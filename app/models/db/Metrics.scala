package models.db

import java.util.UUID

import cats.syntax.either._
import com.gu.editorialproductionmetricsmodels.models.{ForkData, MetricOpt, OriginatingSystem, ProductionOffice}
import io.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.parser._
import io.circe.syntax._
import models.ProductionMetricsError
import org.joda.time.DateTime
import play.api.Logger
import util.Parser.jsonToMetric
import util.Utils.processException

case class Metric(
   id: String,
   originatingSystem: OriginatingSystem = OriginatingSystem.Composer,
   composerId: Option[String] = None,
   storyBundleId: Option[String] = None,
   commissioningDesk: Option[String] = None,
   userDesk: Option[String] = None,
   inWorkflow: Boolean = false,
   inNewspaper: Boolean = false,
   creationTime: DateTime,
   firstPublicationTime: Option[DateTime] = None,
   roundTrip: Boolean = false,
   productionOffice: Option[ProductionOffice] = None,
   issueDate: Option[DateTime] = None,
   bookSectionName: Option[String] = None,
   bookSectionCode: Option[String] = None,
   newspaperBook: Option[String] = None,
   newspaperBookSection: Option[String] = None)

object Metric {
  def apply(metricOpt: MetricOpt): Metric = Metric(
    id = metricOpt.id.getOrElse(UUID.randomUUID().toString),
    originatingSystem = metricOpt.originatingSystem.getOrElse(OriginatingSystem.Composer),
    composerId = metricOpt.composerId,
    storyBundleId = metricOpt.storyBundleId,
    commissioningDesk = metricOpt.commissioningDesk,
    userDesk = metricOpt.userDesk,
    inWorkflow = metricOpt.inWorkflow.getOrElse(false),
    inNewspaper = metricOpt.inNewspaper.getOrElse(false),
    creationTime = metricOpt.creationTime.getOrElse(DateTime.now()),
    firstPublicationTime = metricOpt.firstPublicationTime,
    roundTrip = metricOpt.roundTrip.getOrElse(false),
    productionOffice = metricOpt.productionOffice,
    issueDate = metricOpt.issueDate,
    bookSectionName = metricOpt.bookSectionName,
    bookSectionCode = metricOpt.bookSectionCode,
    newspaperBook = metricOpt.newspaperBook,
    newspaperBookSection = metricOpt.newspaperBookSection
  )

  private val datePattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

  def customApply(tuple: (
      String,
      OriginatingSystem,
      Option[String],
      Option[String],
      Option[String],
      Option[String],
      Boolean,
      Boolean,
      DateTime,
      Option[DateTime],
      Boolean,
      Option[ProductionOffice],
      Option[DateTime],
      Option[String],
      Option[String],
      Option[String],
      Option[String])
   ): Metric =
    Metric(
      id = tuple._1,
      originatingSystem = tuple._2,
      composerId = tuple._3,
      storyBundleId = tuple._4,
      commissioningDesk = tuple._5,
      userDesk = tuple._6,
      inWorkflow = tuple._7,
      inNewspaper = tuple._8,
      creationTime = tuple._9,
      firstPublicationTime = tuple._10,
      roundTrip = tuple._11,
      productionOffice = tuple._12,
      issueDate = tuple._13,
      bookSectionName = tuple._14,
      bookSectionCode = tuple._15,
      newspaperBook = tuple._16,
      newspaperBookSection = tuple._17)

  implicit val timeEncoder = new Encoder[DateTime] {
    def apply(d: DateTime) = d.toString(datePattern).asJson
  }
  implicit val dateDecoder = new Decoder[DateTime] {
    def apply(c: HCursor): Decoder.Result[DateTime] = {
      val dateTime = for {
        value <- c.focus
        string <- value.asString
      } yield new DateTime(string)
      dateTime.fold[Decoder.Result[DateTime]](Left(DecodingFailure("could not decode date", c.history)))(dt => Right(dt))
    }
  }
  implicit val metricEncoder: Encoder[Metric] = deriveEncoder
  implicit val metricDecoder: Decoder[Metric] = deriveDecoder

  // This only updates the fields that metric and metricOptJson have in common
  def updateMetric(metric: Metric, metricOpt: MetricOpt): Either[ProductionMetricsError, Metric] = {
    // We use a printer to remove the null values. Nulls are treated as values in Circe. Not removing them results
    // in replacing the existing values with null.
    val printer = Printer.noSpaces.copy(dropNullKeys = true)
    val jsonOpt: String = printer.pretty(metricOpt.asJson)

    val result = for {
      j1 <- parse(jsonOpt)
      j2 = metric.asJson
    } yield j2.deepMerge(j1)

    result.fold(
      err => {
        Logger.error(s"Json merging failed for $metric and $metricOpt: ${err.message}")
        processException(err)
      },
      r => jsonToMetric(r))
  }
}

case class Fork(
   id: String,
   composerId: String,
   time: DateTime,
   wordCount: Int,
   revisionNumber: Int,
   timeToPublication: Option[Int] = None,
   octopusStatus: Option[String] = None,
   forkApplication: Option[String] = None,
   workflowStatus: Option[String] = None)

object Fork {
  def apply(forkData: ForkData): Fork =
    new Fork(
      id = UUID.randomUUID.toString,
      composerId = forkData.digitalDetails.composerId,
      time = forkData.time,
      wordCount = forkData.printDetails.wordCount,
      revisionNumber = forkData.digitalDetails.revisionNumber,
      timeToPublication = Some(forkData.timeToPublication),
      octopusStatus = Some(forkData.printDetails.octopusStatus),
      forkApplication = Some(forkData.printDetails.forkApplication),
      workflowStatus = forkData.digitalDetails.workflowStatus)

  def customApply(tuple: (String, String, DateTime, Int, Int, Option[Int], Option[String], Option[String], Option[String])): Fork =
    Fork(
      id = tuple._1,
      composerId = tuple._2,
      time = tuple._3,
      wordCount = tuple._4,
      revisionNumber = tuple._5,
      timeToPublication = tuple._6,
      octopusStatus = tuple._7,
      forkApplication = tuple._8,
      workflowStatus = tuple._9)
}
