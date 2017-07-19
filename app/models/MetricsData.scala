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

  implicit val publishingSystemFormat = Format(publishingSystemReads, publishingSystemWrites)
}

case class Metrics (
    id: String,
    contentCreated: Long,
    composerId: Option[String],
    storyBundleId: Option[String],
    firstSeenInWorkflow: Option[Long],
    firstSeenInComposer: Option[Long],
    firstSeenInInCopy: Option[Long],
    inWorkflow: Boolean,
    inNewspaper: Boolean,
    onlinePublicationTime: Option[Long],
    commissioningDesk: Option[String],
    section: Option[String],
    desk: Option[String],
    startingSystem: PublishingSystem,
    forkTime: Option[Long])

case class InCopyData (
   storyBundleId: String,
   desk: String,
   section: String)

case class ComposerData (composerId: String)


