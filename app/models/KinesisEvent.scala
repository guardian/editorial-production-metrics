package models

import enumeratum.{CirceEnum, Enum, EnumEntry}

sealed trait EventType extends EnumEntry
case object EventType extends Enum[EventType] with CirceEnum[EventType] {
  case object CreatedContent extends EventType
  case object ForkedContent extends EventType

  val values = findValues
}

case class KinesisEvent(
   event: EventType,
   composerId: Option[String],
   storyBundleId: Option[String],
   wordCount: Int,
   revisionNumber: Int,
   startingSystem: PublishingSystem)