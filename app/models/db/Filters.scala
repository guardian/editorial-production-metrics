package models.db

import com.github.tototoshi.slick.PostgresJodaSupport._
import com.gu.editorialproductionmetricsmodels.models.{OriginatingSystem, ProductionOffice}
import models.db.Schema.DBMetric
import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Rep

import scala.util.Try
import scala.util.control.NonFatal

case class DateRange (from: DateTime, to: DateTime)

case class Filters(
  dateRange: Option[DateRange] = None,
  desk: Option[String] = None,
  originatingSystem: Option[OriginatingSystem] = None,
  productionOffice: Option[ProductionOffice] = None,
  inWorkflow: Option[Boolean] = None,
  newspaperBook: Option[String] = None,
  hasCommissionedLength: Option[Boolean] = None,
  maxForkTimeInMilliseconds: Option[Int] = None
)

object Filters {

  //Represents composer id, time to publication and time of fork
  type ForkFilterColumns = (Rep[String], Rep[Option[Int]], Rep[DateTime])

  private val TrueOptCol: Rep[Option[Boolean]] = LiteralColumn(Some(true))

  def apply(queryString: Map[String, Seq[String]]): Filters =
    Filters(
      dateRange = extractDateRange(queryString),
      desk = getOptionStringFromQS("desk", queryString),
      originatingSystem = OriginatingSystem.withNameOption(getOptionStringFromQS("originatingSystem", queryString).getOrElse("")),
      productionOffice = ProductionOffice.withNameOption(getOptionStringFromQS("productionOffice", queryString).getOrElse("")),
      maxForkTimeInMilliseconds = getOptionIntFromQs("maxForkTimeInMilliseconds", queryString)
    )

  private def extractDateRange(qs: Map[String, Seq[String]]): Option[DateRange] = {
    val date: Option[String] = getOptionStringFromQS("date", qs)
    val dateRange: Option[DateRange] = date.fold(None: Option[DateRange])(getDateRangeFromDateString)

    dateRange match {
      case None => Some(DateRange(
        from = getOptionStringFromQS("startDate", qs).flatMap(parseDate).getOrElse(new DateTime(0)),
        to = getOptionStringFromQS("endDate", qs).flatMap(parseDate).getOrElse(DateTime.now())))
      case Some(range) => Some(range)
    }
  }

  private def parseDate(dateString: String): Option[DateTime] = dateString match {
    case "" => None
    case _ =>
      try { Some(ISODateTimeFormat.dateTimeParser.parseDateTime(dateString)) }
      catch { case NonFatal(_) => None }
  }

  private def getDateRangeFromDateString(date: String): Option[DateRange] = date match {
    case "today" => Some(DateRange(
      from = DateTime.now().withTimeAtStartOfDay(),
      to = DateTime.now()))
    case "yesterday" => Some(DateRange(
      from = DateTime.now().minusDays(1).withTimeAtStartOfDay(),
      to = DateTime.now().withTimeAtStartOfDay()))
    case "" => None
  }

  private def getOptionStringFromQS(key: String, qs: Map[String, Seq[String]]): Option[String] = qs.get(key).flatMap(_.headOption)

  private def getOptionIntFromQs(key: String, qs: Map[String, Seq[String]]): Option[Int] = getOptionStringFromQS(key, qs).flatMap(value => Try(value.toInt).toOption)


  def originFilters(implicit filters: Filters): DBMetric => Rep[Option[Boolean]] = metric => combineFiltersForOrigin(metric)

  def wordCountFilters(implicit filters: Filters): DBMetric => Rep[Option[Boolean]] =
    metric => combineFiltersForWordCount(metric)

  def forkFilters(implicit filters: Filters): ((ForkFilterColumns, DBMetric)) => Rep[Option[Boolean]] = forkAndMetric =>
    combineFiltersForFork(forkAndMetric)

  private def combineFiltersForWordCount(metric: Schema.DBMetric)
                                               (implicit filters: Filters): Rep[Option[Boolean]] = {
    // Filtering on headline as all content without a headline predates the collection of wordcount metrics so does not make sense to return
    metric.headline =!= "" &&
      filters.hasCommissionedLength.fold(TrueOptCol)(booleanValue => metric.commissionedWordCount.isDefined.? === booleanValue) &&
      filters.dateRange.fold(TrueOptCol)(dr => metric.firstPublicationTime >= dr.from && metric.firstPublicationTime <= dr.to) &&
      commonFilters(metric)
  }
  private def combineFiltersForFork(data: (ForkFilterColumns, Schema.DBMetric))(implicit filters: Filters): Rep[Option[Boolean]] = {
    val (fork, metric) = data
    filters.dateRange.fold(TrueOptCol)(dr => fork._3.? >= dr.from && fork._3.? <= dr.to) &&
      filters.newspaperBook.fold(TrueOptCol)(nb => metric.newspaperBook.toLowerCase === nb.toLowerCase) &&
      filters.maxForkTimeInMilliseconds.fold(TrueOptCol)(timeToPublication => fork._2 <= timeToPublication) &&
      commonFilters(metric)
  }

  private def combineFiltersForOrigin(metric: Schema.DBMetric)(implicit filters: Filters): Rep[Option[Boolean]] = {
    import MetricHelpers._
    filters.dateRange.fold(TrueOptCol)(dr => metric.creationTime.? >= dr.from && metric.creationTime.? <= dr.to) &&
      filters.inWorkflow.fold(TrueOptCol)(inWf => metric.inWorkflow.? === inWf) &&
      filters.originatingSystem.fold(TrueOptCol)(os => metric.originatingSystem.? === os) &&
      commonFilters(metric)
  }

  private def commonFilters(metric: Schema.DBMetric)(implicit filters: Filters): Rep[Option[Boolean]] = {
    import MetricHelpers._
    filters.desk.fold(TrueOptCol)(d => metric.commissioningDesk.toLowerCase === d.toLowerCase) &&
      filters.productionOffice.fold(TrueOptCol)(po => metric.productionOffice.? === Option(po))
  }
}
