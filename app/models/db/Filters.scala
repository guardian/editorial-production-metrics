package models.db

import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat

import scala.util.control.NonFatal

case class DateRange (from: Option[DateTime], to: Option[DateTime])

case class Filters(
  dateRange: Option[DateRange],
  desk: Option[String]
)

object Filters {
  def apply(queryString: Map[String, Seq[String]]): Filters =
    Filters(
      dateRange = extractDateRange(queryString),
      desk = getOptionFromQS("desk", queryString)
    )

  private def getOptionFromQS(key: String, qs: Map[String, Seq[String]]): Option[String] = qs.get(key).flatMap(_.headOption)

  private def parseDate(dateString: String): Option[DateTime] = dateString match {
    case "" => None
    case _ =>
      try { Some(ISODateTimeFormat.dateTimeParser.parseDateTime(dateString)) }
      catch { case NonFatal(_) => None }
  }

  private def extractDateRange(qs: Map[String, Seq[String]]): Option[DateRange] = {
    val date: Option[String] = getOptionFromQS("date", qs)
    val dateRange: Option[DateRange] = date.fold(None: Option[DateRange])(getDateRangeFromDateString)

    dateRange match {
      case None => Some(DateRange(
        from = getOptionFromQS("date.from", qs).flatMap(parseDate),
        to = getOptionFromQS("date.to", qs).flatMap(parseDate)))
      case Some(range) => Some(range)
    }
  }

  private def getDateRangeFromDateString(date: String): Option[DateRange] = date match {
    case "today" => Some(DateRange(
      from = Some(DateTime.now().withTimeAtStartOfDay()),
      to = Some(DateTime.now())))
    case "yesterday" => Some(DateRange(
      from = Some(DateTime.now().minusDays(1).withTimeAtStartOfDay()),
      to = Some(DateTime.now().withTimeAtStartOfDay())))
    case "" => None
  }
}
