package models.db

import java.sql.Timestamp

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import models.db.Schema.DBMetric
import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat
import slick.jdbc.PostgresProfile.api._
import slick.lifted.{LiteralColumn, Rep}

import scala.util.control.NonFatal

case class DateRange (from: DateTime, to: DateTime)

case class MetricsFilters(
  dateRange: Option[DateRange] = None,
  desk: Option[String] = None,
  originatingSystem: Option[OriginatingSystem] = None
)

object MetricsFilters {
  private val TrueOptCol : Rep[Option[Boolean]] = LiteralColumn(Some(true))

  def apply(queryString: Map[String, Seq[String]]): MetricsFilters =
    MetricsFilters(
      dateRange = extractDateRange(queryString),
      desk = getOptionFromQS("desk", queryString),
      originatingSystem = OriginatingSystem.withNameOption(getOptionFromQS("originatingSystem", queryString).getOrElse(""))
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

  private def getOptionFromQS(key: String, qs: Map[String, Seq[String]]): Option[String] = qs.get(key).flatMap(_.headOption)

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

  def metricFilters(implicit filters: MetricsFilters): DBMetric => Rep[Option[Boolean]] = { metric =>
    filters.desk.fold(TrueOptCol)(d => metric.commissioningDesk.toLowerCase === d.toLowerCase) &&
    filters.originatingSystem.fold(TrueOptCol)(os => metric.originatingSystem.toLowerCase.? === os.entryName.toLowerCase) &&
    filters.dateRange.fold(TrueOptCol)(dr => metric.creationTime.? >= new Timestamp(dr.from.getMillis) && metric.creationTime.? <= new Timestamp(dr.to.getMillis))
  }
}

case class CountResponse(date: DateTime, count: Int)
object CountResponse {
  private val datePattern = "yyyy-MM-dd'T'HH:mm:ss'Z'"

  implicit val timeEncoder = new Encoder[DateTime] {
    def apply(d: DateTime) = d.toString(datePattern).asJson
  }
  implicit val metricEncoder: Encoder[Metric] = deriveEncoder
}