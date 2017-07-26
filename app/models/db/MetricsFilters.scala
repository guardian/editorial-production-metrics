package models.db

import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat

import scala.util.control.NonFatal

case class DateRange (from: Option[DateTime], to: Option[DateTime])

case class MetricsFilters(
  dateRange: Option[DateRange],
  desk: Option[String],
  startingSystem: Option[String] = None,
  filtersList: List[String]
)

object MetricsFilters {
  def apply(queryString: Map[String, Seq[String]]): MetricsFilters =
    MetricsFilters(
      dateRange = extractDateRange(queryString),
      desk = getOptionFromQS("desk", queryString),
      filtersList = List("dateRange", "desk", "startingSystem")
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
      case None =>
        val start = getOptionFromQS("startDate", qs).flatMap(parseDate)
        val end = getOptionFromQS("endDate", qs).flatMap(parseDate)

        if(start.isEmpty && end.isEmpty) None
        else Some(DateRange(from = start, to = end))

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
