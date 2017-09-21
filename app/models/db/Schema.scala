package models.db

import com.github.tototoshi.slick.PostgresJodaSupport._
import com.gu.editorialproductionmetricsmodels.models.{OriginatingSystem, ProductionOffice}
import org.joda.time.DateTime
import slick.jdbc.PostgresProfile.api._
import slick.lifted.{TableQuery, Tag}

object Schema {

  val metricsTable: TableQuery[DBMetric] = TableQuery[DBMetric]
  val inCopyMetricsTable: TableQuery[DBInCopyMetric] = TableQuery[DBInCopyMetric]
  val composerMetricsTable: TableQuery[DBComposerMetric] = TableQuery[DBComposerMetric]
  val forksTable: TableQuery[DBFork] = TableQuery[DBFork]

  class DBMetric(tag: Tag) extends Table[Metric](tag, "metrics") {
    import MetricHelpers._
    def id                    = column[String]("id", O.PrimaryKey)
    def originatingSystem     = column[OriginatingSystem]("originating_system")
    def composerId            = column[Option[String]]("composer_id")
    def storyBundleId         = column[Option[String]]("story_bundle_id")
    def commissioningDesk     = column[Option[String]]("commissioning_desk")
    def userDesk              = column[Option[String]]("user_desk")
    def inWorkflow            = column[Boolean]("in_workflow")
    def inNewspaper           = column[Boolean]("in_newspaper")
    def creationTime          = column[DateTime]("creation_time")
    def firstPublicationTime  = column[Option[DateTime]]("publication_time")
    def roundTrip             = column[Boolean]("round_trip")
    def productionOffice      = column[Option[ProductionOffice]]("production_office")
    def * = (
      id,
      originatingSystem,
      composerId,
      storyBundleId,
      commissioningDesk,
      userDesk,
      inWorkflow,
      inNewspaper,
      creationTime,
      firstPublicationTime,
      roundTrip,
      productionOffice) <> (Metric.customApply _, Metric.unapply _)
  }

  class DBInCopyMetric(tag: Tag) extends Table[InCopyMetric](tag, "incopy_metrics") {
    def storyBundleId       = column[String]("story_bundle_id", O.PrimaryKey)
    def timeFinalised       = column[Option[DateTime]]("time_finalised")
    def wordCount           = column[Int]("word_count")
    def revisionNumber      = column[Int]("revision_number")
    def * = (storyBundleId, timeFinalised, wordCount, revisionNumber) <> (InCopyMetric.tupled, InCopyMetric.unapply)
  }

  class DBComposerMetric(tag: Tag) extends Table[ComposerMetric](tag, "composer_metrics") {
    def composerId          = column[String]("composer_id", O.PrimaryKey)
    def firstPublished      = column[Option[DateTime]]("first_published")
    def createdInWorkflow   = column[Option[Boolean]]("created_in_workflow")
    def * = (composerId, firstPublished, createdInWorkflow) <> (ComposerMetric.tupled, ComposerMetric.unapply)
  }

  class DBFork(tag: Tag) extends Table[Fork](tag, "forks") {
    def id                  = column[String]("id", O.PrimaryKey)
    def composerId          = column[String]("composer_id")
    def time                = column[DateTime]("time")
    def wordCount           = column[Int]("word_count")
    def revisionNumber      = column[Int]("revision_number")
    def issueDate           = column[Option[DateTime]]("issue_date")
    def timeUntilFork       = column[Option[Int]]("time_until_fork")
    def * = (id, composerId, time, wordCount, revisionNumber, issueDate, timeUntilFork) <> (Fork.customApply, Fork.unapply)
  }
}

object MetricHelpers {
  implicit val originatingSystemEncDec = MappedColumnType.base[OriginatingSystem, String](os => os.entryName, name => OriginatingSystem.withName(name))
  implicit val productionOfficeEncDec = MappedColumnType.base[ProductionOffice, String](po => po.entryName, name => ProductionOffice.withName(name))
}