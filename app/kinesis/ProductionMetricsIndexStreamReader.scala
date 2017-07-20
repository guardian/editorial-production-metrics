package lib.kinesis

import java.util.UUID
import com.amazonaws.auth.AWSCredentialsProviderChain
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.kinesis.clientlibrary.interfaces.IRecordProcessorFactory
import config.Config
import database.MetricsDB
import lib.kinesis.EventProcessor.EventWithSize
import lib.kinesis.ProductionMetricsStreamReader.ProductionMetricsEventProcessor
import models.db.Metric
import models.{CapiContent, CapiData, KinesisEvent}
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import play.api.Logger
import play.api.libs.json.JsValue

import scala.concurrent.duration.{Duration, _}

class ProductionMetricsStreamReader(override val streamName: String, override val stage: String, override val config: Config, val db: MetricsDB)
  extends KinesisStreamReader {

  val kinesisCredentialsProvider = new AWSCredentialsProviderChain(new ProfileCredentialsProvider("composer"))

  val dynamoCredentialsProvider: AWSCredentialsProviderChain = kinesisCredentialsProvider

  protected val eventProcessorFactory = new IRecordProcessorFactory {
    override def createProcessor() =
      new ProductionMetricsEventProcessor(db)
  }
}

object ProductionMetricsStreamReader {

  /**
    * A processor that parses flexible content and publishes content to Postgres.
    *
    * Note that one of these processors will be created for each shard of the Kinesis stream.
    */
  class ProductionMetricsEventProcessor(
    db: MetricsDB,
    checkpointInterval: Duration = 30.seconds,
    maxCheckpointBatchSize: Int = 20)
    extends EventProcessor[KinesisEvent](checkpointInterval, maxCheckpointBatchSize)
      with SingleEventProcessor[KinesisEvent] {


    def isActivated = true

    val codec = KinesisEvent

    override protected def processEvent(eventWithSize: EventWithSize[KinesisEvent]): Unit = {
      val event = eventWithSize.event
      val eventType = event.eventType
      eventType match {
        case CapiContent => processCapiEvent(event.eventJson)
        case _ => Logger.error(s"Invalid event type on kinesis stream could not be processed ${event}")
      }
    }

    private def convertStringToDateTime(dateTime: String): Option[DateTime] = {
      val formatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ssZ")
      try {
        Some(formatter.parseDateTime(dateTime))
      }
      catch {
        case e: Throwable => {
          Logger.error(s"String $dateTime could not be converted to datetime. $e")
          None
        }
      }
    }

    private def processCapiEvent(json: JsValue) = {
      try {
        val data = json.as[CapiData]
        for {
          date <- convertStringToDateTime(data.creationDate)
          metric = Metric(UUID.randomUUID().toString, data.startingSystem, Some(data.composerId), data.storyBundleId,
            Some(data.commissioningDesk), None, false, false, date, false)
        } yield db.insertPublishingMetric(metric)
      }
      catch {
        case e: Throwable => Logger.error(s"Could not process event with json ${json}. ${e}")
      }
    }
  }
}
