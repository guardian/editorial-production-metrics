package models.db

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