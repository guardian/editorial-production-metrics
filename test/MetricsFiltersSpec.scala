import com.gu.editorialproductionmetricsmodels.models.{OriginatingSystem, ProductionOffice}
import models.db.{DateRange, MetricsFilters}
import org.joda.time.DateTime

class MetricsFiltersSpec extends BaseSuite {
  test("create a MetricFilter from a valid query string") {
    val queryString = Map("productionOffice" -> Seq("uk"), "desk" -> Seq("news"), "originatingSystem" -> Seq("composer"))
    val metricsFilters = MetricsFilters(queryString)
    metricsFilters should equal(
      MetricsFilters(
        productionOffice = Some(ProductionOffice.Uk),
        desk = Some("news"),
        originatingSystem = Some(OriginatingSystem.Composer)
      ).copy(dateRange = metricsFilters.dateRange))
  }

  test("create a MetricFilter with correct date range from startDate and endDate parameters") {
    val queryString = Map("startDate" -> Seq("2017-08-01T00:00:00Z"), "endDate" -> Seq("2017-08-31T00:00:00Z"))
    val metricsFilters = MetricsFilters(queryString)
    metricsFilters should equal(
      MetricsFilters(
        dateRange = Some(DateRange(from = new DateTime("2017-08-01T00:00:00Z"), to = new DateTime("2017-08-31T00:00:00Z")))
      ))
  }

  test("create a MetricFilter with correct date range from date = today") {
    val queryString = Map("date" -> Seq("today"))
    val metricsFilters = MetricsFilters(queryString)
    metricsFilters should equal(
      MetricsFilters(
        dateRange = Some(DateRange(from = DateTime.now().withTimeAtStartOfDay(), to = metricsFilters.dateRange.get.to))
      ))
  }

  test("create a MetricFilter with correct date range from date = yesterday") {
    val queryString = Map("date" -> Seq("yesterday"))
    val metricsFilters = MetricsFilters(queryString)
    metricsFilters should equal(
      MetricsFilters(
        dateRange = Some(DateRange(from = DateTime.now().minusDays(1).withTimeAtStartOfDay(), to = DateTime.now().withTimeAtStartOfDay()))
      ))
  }
}
