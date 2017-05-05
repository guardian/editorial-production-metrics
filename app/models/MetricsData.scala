package models

sealed trait PublishingSystem
case object Composer extends PublishingSystem
case object InCopy extends PublishingSystem

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


