package models.db

import com.github.tototoshi.slick.PostgresJodaSupport._
import com.gu.editorialproductionmetricsmodels.models.{OriginatingSystem, ProductionOffice}
import org.joda.time.DateTime
import slick.jdbc.PostgresProfile.api._
import slick.lifted.{TableQuery, Tag}

object Schema {

  val metricsTable: TableQuery[DBMetric] = TableQuery[DBMetric]
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
    def issueDate             = column[Option[DateTime]]("issue_date")
    def bookSectionName       = column[Option[String]]("book_section_name")
    def bookSectionCode       = column[Option[String]]("book_section_code")
    def newspaperBook         = column[Option[String]]("newspaper_book")
    def newspaperBookSection  = column[Option[String]]("newspaper_book_section")
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
      productionOffice,
      issueDate,
      bookSectionName,
      bookSectionCode,
      newspaperBook,
      newspaperBookSection) <> (Metric.customApply _, Metric.unapply _)
  }

  class DBFork(tag: Tag) extends Table[Fork](tag, "forks") {
    def id                  = column[String]("id", O.PrimaryKey)
    def composerId          = column[String]("composer_id")
    def time                = column[DateTime]("time")
    def wordCount           = column[Int]("word_count")
    def revisionNumber      = column[Int]("revision_number")
    def timeToPublication   = column[Option[Int]]("time_to_publication")
    def octopusStatus       = column[Option[String]]("octopus_status")
    def forkApplication     = column[Option[String]]("fork_application")
    def workflowStatus      = column[Option[String]]("workflow_status")
    def * = (
      id,
      composerId,
      time,
      wordCount,
      revisionNumber,
      timeToPublication,
      octopusStatus,
      forkApplication,
      workflowStatus) <> (Fork.customApply, Fork.unapply)
  }
}

object MetricHelpers {
  implicit val originatingSystemEncDec = MappedColumnType.base[OriginatingSystem, String](os => os.entryName, name => OriginatingSystem.withName(name))
  implicit val productionOfficeEncDec = MappedColumnType.base[ProductionOffice, String](po => po.entryName, name => ProductionOffice.withName(name))
}