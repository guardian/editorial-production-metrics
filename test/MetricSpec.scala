import com.gu.editorialproductionmetricsmodels.models.{MetricOpt, OriginatingSystem}
import models.db.Metric
import org.joda.time.DateTime

class MetricSpec extends BaseSuite {
  test("merge a Metric and a MetricOpt together by updating the not null values") {
    val metric = Metric(
      id = "id123",
      originatingSystem = OriginatingSystem.Composer,
      creationTime = new DateTime("2017-08-01T00:00:00Z"),
      firstPublicationTime = Some(new DateTime("2017-08-31T00:00:00Z")),
      inWorkflow = true
    )
    val metricOpt = MetricOpt(
      originatingSystem = Some(OriginatingSystem.InCopy),
      inWorkflow = Some(true)
    )
  }
}
