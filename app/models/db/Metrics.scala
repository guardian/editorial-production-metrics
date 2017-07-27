package models.db

import enumeratum.EnumEntry.Lowercase
import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import org.joda.time.DateTime

case class Metric(
    id: String,
    startingSystem: String,
    composerId: Option[String],
    storyBundleId: Option[String],
    commissioningDesk: Option[String],
    userDesk: Option[String],
    inWorkflow: Boolean,
    inNewspaper: Boolean,
    creationTime: DateTime,
    roundTrip: Boolean)
object Metric {
  private val datePattern = "yyyy-MM-dd'T'HH:mm:ss'Z'"
  implicit val timeEncoder = new Encoder[DateTime] {
    def apply(d: DateTime) = d.toString(datePattern).asJson
  }
  implicit val metricEncoder: Encoder[Metric] = deriveEncoder
}

sealed trait OriginatingSystem extends EnumEntry with Lowercase
case object OriginatingSystem extends Enum[OriginatingSystem] with CirceEnum[OriginatingSystem] {
  case object Composer extends OriginatingSystem
  case object InCopy extends OriginatingSystem

  val values = findValues
}

case class InCopyMetric(
    storyBundleId: String,
    timeFinalised: Option[DateTime],
    wordCount: Int,
    revisionNumber: Int)

case class ComposerMetric(
    composerId: String,
    firstPublished: Option[DateTime],
    createdInWorkflow: Boolean)

case class Fork(
    id: String,
    composerId: String,
    time: DateTime,
    wordCount: Int,
    revisionNumber: Int)
