package models.db

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import org.joda.time.DateTime

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
  def customApply(tuple: (String, String, Option[String],Option[String],Option[String],Option[String],Option[Boolean],Option[Boolean],DateTime,Option[Boolean])): Metric =
    Metric(tuple._1, OriginatingSystem.withName(tuple._2), tuple._3, tuple._4, tuple._5, tuple._6, tuple._7, tuple._8, tuple._9, tuple._10)

  def customUnapply(metric: Metric): Option[(String, String, Option[String],Option[String],Option[String],Option[String],Option[Boolean],Option[Boolean],DateTime,Option[Boolean])] =
    Some((metric.id, metric.originatingSystem.entryName, metric.composerId, metric.storyBundleId, metric.commissioningDesk, metric.userDesk, metric.inWorkflow, metric.inNewspaper, metric.creationTime, metric.roundTrip))

  private val datePattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  implicit val timeEncoder = new Encoder[DateTime] {
    def apply(d: DateTime) = d.toString(datePattern).asJson
  }
  implicit val metricEncoder: Encoder[Metric] = deriveEncoder
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
