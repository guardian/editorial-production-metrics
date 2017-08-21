package models.db

import java.sql.Timestamp

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import io.circe._
import io.circe.syntax._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import models.ProductionMetricsError
import org.joda.time.DateTime
import util.Parser.jsonToMetric

case class Metric(
    id: String,
    originatingSystem: OriginatingSystem,
    composerId: Option[String],
    storyBundleId: Option[String],
    commissioningDesk: Option[String],
    userDesk: Option[String],
    inWorkflow: Option[Boolean],
    inNewspaper: Option[Boolean],
    creationTime: DateTime,
    roundTrip: Option[Boolean])
object Metric {
  private val datePattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

  def customApply(tuple: (String, String, Option[String],Option[String],Option[String],Option[String],Option[Boolean],Option[Boolean],Timestamp,Option[Boolean])): Metric =
    Metric(tuple._1, OriginatingSystem.withName(tuple._2), tuple._3, tuple._4, tuple._5, tuple._6, tuple._7, tuple._8, new DateTime(tuple._9), tuple._10)

  def customUnapply(metric: Metric): Option[(String, String, Option[String],Option[String],Option[String],Option[String],Option[Boolean],Option[Boolean],Timestamp,Option[Boolean])] =
    Some((metric.id, metric.originatingSystem.entryName, metric.composerId, metric.storyBundleId, metric.commissioningDesk, metric.userDesk, metric.inWorkflow, metric.inNewspaper, new Timestamp(metric.creationTime.getMillis), metric.roundTrip))

  implicit val timeEncoder = new Encoder[DateTime] {
    def apply(d: DateTime) = d.toString(datePattern).asJson
  }
  implicit val dateDecoder = new Decoder[DateTime] {
    def apply(c: HCursor): Decoder.Result[DateTime] = {
      val dateTime = for {
        value <- c.focus
        string <- value.asString
      } yield new DateTime(string)
      dateTime.fold[Decoder.Result[DateTime]](Left(DecodingFailure("could not decode date", c.history)))(dt => Right(dt))
    }
  }
  implicit val metricEncoder: Encoder[Metric] = deriveEncoder
  implicit val metricDecoder: Decoder[Metric] = deriveDecoder

  // This only updates the fields that metric and metricOptJson have in common
  def updateMetric(metric: Metric, metricOptJson: Json): Either[ProductionMetricsError, Metric] =
    jsonToMetric(metric.asJson.deepMerge(metricOptJson))
}

case class InCopyMetric(
    storyBundleId: String,
    timeFinalised: Option[DateTime],
    wordCount: Int,
    revisionNumber: Int)

case class ComposerMetric(
    composerId: String,
    firstPublished: Option[DateTime],
    createdInWorkflow: Option[Boolean])

case class Fork(
    id: String,
    composerId: String,
    time: DateTime,
    wordCount: Int,
    revisionNumber: Int)
