package models

import play.api.libs.json._

sealed trait PublishingSystem
case object Composer extends PublishingSystem
case object InCopy extends PublishingSystem


object PublishingSystem {
  val publishingSystemWrites = new Writes[PublishingSystem] {
    override def writes(priority: PublishingSystem): JsValue = priority match {
      case Composer => JsString("Composer")
      case InCopy    => JsString("InCopy")
    }
  }

  val publishingSystemReads = new Reads[PublishingSystem] {
    override def reads(json: JsValue): JsResult[PublishingSystem] = json match {
      case JsString("Composer") => JsSuccess(Composer)
      case JsString("InCopy")     => JsSuccess(InCopy)
      case _                      => JsError("Invalid publishing system")
    }
  }

  implicit val publishingSystenFormat = Format(publishingSystemReads, publishingSystemWrites)

}

sealed trait EventType
case object CreatedContent extends EventType
case object ForkedContent extends EventType
case object CapiContent extends EventType

object EventType {
  val eventTypeWrites = new Writes[EventType] {
    override def writes(priority: EventType): JsValue = priority match {
      case CreatedContent => JsString("CreatedContent")
      case ForkedContent => JsString("ForkedContent")
      case CapiContent => JsString("CapiContent")
    }
  }

  val eventTypeReads = new Reads[EventType] {
    override def reads(json: JsValue): JsResult[EventType] = json match {
      case JsString("CreatedContent") => JsSuccess(CreatedContent)
      case JsString("ForkedContent")  => JsSuccess(ForkedContent)
      case JsString("CapiContent") => JsSuccess(CapiContent)
      case _                      => JsError("Invalid event type")
    }
  }

  implicit val eventFormat = Format(eventTypeReads, eventTypeWrites)

}

case class KinesisEvent(eventType: EventType, eventJson: JsValue)

object KinesisEvent {
  implicit val format = Json.format[KinesisEvent]
}

case class CapiData(
                     composerId: String,
                     storyBundleId: Option[String],
                     newspaperBookTag: Option[String],
                     creationDate: String,
                     commissioningDesk: String,
                     startingSystem: String)

object CapiData {
  implicit val format = Json.format[CapiData]
}