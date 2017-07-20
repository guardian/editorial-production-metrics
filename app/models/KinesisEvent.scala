package models

import play.api.libs.json._

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
      case JsString("ForkedContent") => JsSuccess(ForkedContent)
      case JsString("CapiContent") => JsSuccess(CapiContent)
      case _ => JsError("Invalid event type")
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