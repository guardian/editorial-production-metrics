package models

import play.api.libs.json._

sealed trait EventType
case object CreatedContent extends EventType
case object ForkedContent extends EventType

object EventType {
  val eventTypeWrites = new Writes[EventType] {
    override def writes(priority: EventType): JsValue = priority match {
      case CreatedContent => JsString("CreatedContent")
      case ForkedContent => JsString("ForkedContent")
    }
  }

  val eventTypeReads = new Reads[EventType] {
    override def reads(json: JsValue): JsResult[EventType] = json match {
      case JsString("CreatedContent") => JsSuccess(CreatedContent)
      case JsString("ForkedContent") => JsSuccess(ForkedContent)
      case _ => JsError("Invalid event type")
    }
  }

  implicit val eventFormat = Format(eventTypeReads, eventTypeWrites)
}

case class KinesisEvent(
   event: EventType,
   composerId: Option[String],
   storyBundleId: Option[String],
   wordCount: Int,
   revisionNumber: Int,
   startingSystem: PublishingSystem)

object KinesisEvent {
  implicit val format = Json.format[KinesisEvent]
}