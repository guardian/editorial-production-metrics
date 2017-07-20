package models

import enumeratum._
import io.circe.Json

sealed trait PublishingSystem extends EnumEntry
case object PublishingSystem extends Enum[PublishingSystem] with CirceEnum[PublishingSystem] {
  case object Composer extends PublishingSystem
  case object InCopy extends PublishingSystem

  val values = findValues
}

sealed trait EventType extends EnumEntry
case object EventType extends Enum[EventType] with CirceEnum[EventType] {
  case object CreatedContent extends EventType
  case object ForkedContent extends EventType
  case object CapiContent extends EventType

  val values = findValues
}

case class KinesisEvent(eventType: EventType, eventJson: Json)

case class CapiData(
                     composerId: String,
                     storyBundleId: Option[String],
                     newspaperBookTag: Option[String],
                     creationDate: String,
                     commissioningDesk: String,
                     startingSystem: String)
