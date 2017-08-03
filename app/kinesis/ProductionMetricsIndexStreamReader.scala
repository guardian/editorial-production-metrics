package lib.kinesis

import java.util.UUID

import com.amazonaws.auth.AWSCredentialsProviderChain
import com.amazonaws.services.kinesis.clientlibrary.interfaces.IRecordProcessorFactory
import com.gu.editorialproductionmetricsmodels.models.EventType.CapiContent
import com.gu.editorialproductionmetricsmodels.models.{CapiData, KinesisEvent}
import config.Config
import database.MetricsDB
import io.circe.Json
import lib.kinesis.EventProcessor.EventWithSize
import lib.kinesis.ProductionMetricsStreamReader.ProductionMetricsEventProcessor
import models.db.Metric
import play.api.Logger
import util.Parser
import util.Utils.convertStringToDateTime

import scala.concurrent.duration.{Duration, _}

class ProductionMetricsStreamReader(override val streamName: String, override val stage: String, override val config: Config, val db: MetricsDB)
  extends KinesisStreamReader {

  val kinesisCredentialsProvider = config.awsCredentialsProvider

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

    private def processCapiEvent(json: Json) =
      Parser.jsonToCapiData(json) match {
        case Right(data) => putCapiDataInDB(data)
        case Left(error) => Logger.error(error.message)
      }


    def putCapiDataInDB(data: CapiData) = {
      for {
        date <- convertStringToDateTime(data.creationDate)
        metric = Metric(id = UUID.randomUUID().toString,
          originatingSystem = data.originatingSystem,
          composerId = Some(data.composerId),
          storyBundleId = data.storyBundleId,
          commissioningDesk = Some(data.commissioningDesk),
          userDesk = None,
          inWorkflow = None,
          inNewspaper = None,
          creationTime = date,
          roundTrip = None)
      } yield db.insertPublishingMetric(metric)
    }
  }
}
