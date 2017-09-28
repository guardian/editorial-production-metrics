import com.gu.editorialproductionmetricsmodels.models.{MetricOpt, OriginatingSystem}
import models.db.Metric
import org.joda.time.DateTime

class MetricSpec extends BaseSuite {
  test("merge a Metric and a MetricOpt together by updating the not null values") {
    val metric = Metric(
      id = "id123",
      originatingSystem = OriginatingSystem.Composer,
      creationTime = new DateTime("2017-08-01T00:00:00Z"),
      inWorkflow = true
    )
    val metricOpt = MetricOpt(
      originatingSystem = Some(OriginatingSystem.InCopy), //override something from Metric
      inWorkflow = Some(true), //same value as in Metric
      newspaperBook = Some("guardian/test"), //new value
      id = None //this should not replace the actual value
    )
    val expectedResult = Metric(
      id = metric.id,
      originatingSystem = metricOpt.originatingSystem.get,
      creationTime = metric.creationTime,
      inWorkflow = metricOpt.inWorkflow.get,
      newspaperBook = metricOpt.newspaperBook
    )
    Metric.updateMetric(metric, metricOpt) should equal(Right(expectedResult))
  }
}
