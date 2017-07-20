package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.Json

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
