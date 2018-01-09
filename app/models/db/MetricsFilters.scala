package models.db

import com.github.tototoshi.slick.PostgresJodaSupport._
import com.gu.editorialproductionmetricsmodels.models.{OriginatingSystem, ProductionOffice}
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import models.db.Schema.DBMetric
import org.joda.time.{DateTime, DateTimeZone}
import org.joda.time.format.ISODateTimeFormat
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Rep

import scala.util.control.NonFatal

case class DateRange (from: DateTime, to: DateTime)

case class MetricsFilters(
  dateRange: Option[DateRange] = None,
  desk: Option[String] = None,
  originatingSystem: Option[OriginatingSystem] = None,
  productionOffice: Option[ProductionOffice] = None,
  inWorkflow: Option[Boolean] = None,
  newspaperBook: Option[String] = None
)

object MetricsFilters {

  type ForkFilterColumns = (Rep[String], Rep[Option[Int]], Rep[DateTime])

  private val TrueOptCol: Rep[Option[Boolean]] = LiteralColumn(Some(true))

  def apply(queryString: Map[String, Seq[String]]): MetricsFilters =
    MetricsFilters(
      dateRange = extractDateRange(queryString),
      desk = getOptionFromQS("desk", queryString),
      originatingSystem = OriginatingSystem.withNameOption(getOptionFromQS("originatingSystem", queryString).getOrElse("")),
      productionOffice = ProductionOffice.withNameOption(getOptionFromQS("productionOffice", queryString).getOrElse(""))
    )

  private def extractDateRange(qs: Map[String, Seq[String]]): Option[DateRange] = {
    val date: Option[String] = getOptionFromQS("date", qs)
    val dateRange: Option[DateRange] = date.fold(None: Option[DateRange])(getDateRangeFromDateString)

    dateRange match {
      case None => Some(DateRange(
        from = getOptionFromQS("startDate", qs).flatMap(parseDate).getOrElse(new DateTime(0)),
        to = getOptionFromQS("endDate", qs).flatMap(parseDate).getOrElse(DateTime.now())))
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

  private def getOptionFromQS(key: String, qs: Map[String, Seq[String]]): Option[String] = qs.get(key).flatMap(_.headOption)

  def metricFilters(implicit filters: MetricsFilters): DBMetric => Rep[Option[Boolean]] = metric => checkMetricsFilters(metric)

  def withoutCommissionedWordCountFilters(implicit filters: MetricsFilters): DBMetric => Rep[Option[Boolean]] =
    metric => checkCommissionedWordCountFilters(metric, false)

  def withCommissionedWordCountFilters(implicit filters: MetricsFilters): DBMetric => Rep[Option[Boolean]] =
    metric => checkCommissionedWordCountFilters(metric, true)

  def forkFilters(implicit filters: MetricsFilters): ((ForkFilterColumns, DBMetric)) => Rep[Option[Boolean]] = forkAndMetric =>
    checkMetricsForkFilters(forkAndMetric)

  private def checkCommissionedWordCountFilters(metric: Schema.DBMetric, withCommissionedWordCount: Boolean)(implicit filters: MetricsFilters): Rep[Option[Boolean]] = {


    Some(withCommissionedWordCount).fold(TrueOptCol)(booleanValue => metric.commissionedWordCount.isDefined === booleanValue) &&
    checkMetricsFilters(metric)
  }
  private def checkMetricsForkFilters(data: (ForkFilterColumns, Schema.DBMetric))(implicit filters: MetricsFilters): Rep[Option[Boolean]] = {
    val (fork, metric) = data
    filters.dateRange.fold(TrueOptCol)(dr => fork._3.? >= dr.from && fork._3.? <= dr.to) &&
      checkCommonFilters(metric)
  }

  private def checkMetricsFilters(metric: Schema.DBMetric)(implicit filters: MetricsFilters): Rep[Option[Boolean]] = {
    filters.dateRange.fold(TrueOptCol)(dr => metric.creationTime.? >= dr.from && metric.creationTime.? <= dr.to) &&
      checkCommonFilters(metric)
  }

  private def checkCommonFilters(metric: Schema.DBMetric)(implicit filters: MetricsFilters): Rep[Option[Boolean]] = {
    import MetricHelpers._
    filters.desk.fold(TrueOptCol)(d => metric.commissioningDesk.toLowerCase === d.toLowerCase) &&
      filters.originatingSystem.fold(TrueOptCol)(os => metric.originatingSystem.? === os) &&
      filters.productionOffice.fold(TrueOptCol)(po => metric.productionOffice === po) &&
      filters.inWorkflow.fold(TrueOptCol)(inWf => metric.inWorkflow.? === inWf) &&
      filters.newspaperBook.fold(TrueOptCol)(nb => metric.newspaperBook.toLowerCase === nb.toLowerCase)
  }
}

case class CountResponse(date: DateTime, count: Int)
object CountResponse {
  private val datePattern = "yyyy-MM-dd'T'HH:mm:ss'Z'"

  implicit val timeEncoder = new Encoder[DateTime] {
    def apply(d: DateTime) = d.withZone(DateTimeZone.UTC).toString(datePattern).asJson
  }
  implicit val metricEncoder: Encoder[Metric] = deriveEncoder
}

case class ForkResponse(issueDate: DateTime, timeToPublication: Int)

object ForkResponse {

  def convertToForkResponse(pair : (Option[Int], DateTime)) = {

    val (timeToPublicationOpt, forkTime) = pair

    timeToPublicationOpt.map(timeToPublication => ForkResponse(forkTime, timeToPublication))
  }
}

case class WordCountResponse(path: Option[String], wordCount: Option[Int], commissionedWordLength: Option[Int])

