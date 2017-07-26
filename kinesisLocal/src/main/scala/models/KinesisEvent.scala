package models

import enumeratum._

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

  val values = findValues
}

case class KinesisEvent(
                         event: EventType,
                         composerId: Option[String],
                         storyBundleId: Option[String],
                         wordCount: Int,
                         revisionNumber: Int,
                         startingSystem: PublishingSystem)
