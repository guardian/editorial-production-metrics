package controllers

import com.gu.editorialproductionmetricsmodels.models.MetricOpt
import database.MetricsDB
import helpers.{PostgresHelpers, TestData}
import models.ProductionMetricsError
import models.db.{Filters, ForkResponse, Metric}
import org.joda.time.DateTime
import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar
import play.api.mvc.Results

class MetricsDBSpec extends AnyFunSuite with MockitoSugar with Matchers with Results with PostgresHelpers {
  implicit val metricsDb: MetricsDB = new MetricsDB()

  private[this] def metricToMetricOpt(metric: Metric): MetricOpt = MetricOpt(
    id = Some(metric.id),
    originatingSystem = Some(metric.originatingSystem),
    composerId = metric.composerId,
    storyBundleId = metric.storyBundleId,
    commissioningDesk = metric.commissioningDesk,
    userDesk = metric.userDesk,
    inWorkflow = Some(metric.inWorkflow),
    inNewspaper = Some(metric.inNewspaper),
    creationTime = Some(metric.creationTime),
    firstPublicationTime = metric.firstPublicationTime,
    roundTrip = Some(metric.roundTrip),
    productionOffice = metric.productionOffice,
    issueDate = metric.issueDate,
    bookSectionName = metric.bookSectionName,
    bookSectionCode = metric.bookSectionCode,
    newspaperBook = metric.newspaperBook,
    newspaperBookSection = metric.newspaperBookSection
  )

  private[this] val testMetric: Metric = TestData.randomMetricWith("composerId_upsert", "storyBundleId_upsert")

  test("Upsert metric - should insert a metric when it doesn't already exist in the db") {
    val result: Either[ProductionMetricsError, Metric] = metricsDb.updateOrInsert(None, metricToMetricOpt(testMetric))
    result shouldBe a [Right[_,_]]

    val actualMetric = result.toOption.get
    val expectedMetric = testMetric.copy(id = actualMetric.id)
    actualMetric shouldBe expectedMetric
  }

  test("Upsert metric - update a metric when it's found in the db") {
    val updatedMetricOpt = metricToMetricOpt(testMetric).copy(
      commissioningDesk = Some("updatedCommissioningDesk"),
      productionOffice = None
    )
    val result: Either[ProductionMetricsError, Metric] = metricsDb.updateOrInsert(Some(testMetric), updatedMetricOpt)
    result shouldBe a [Right[_,_]]

    val actualMetric = result.toOption.get
    val expectedMetric = testMetric.copy(commissioningDesk = updatedMetricOpt.commissioningDesk)
    actualMetric shouldBe expectedMetric
  }

  test("Get forks with filter") {
    val getInitialForks = metricsDb.getForks(Filters())
    getInitialForks shouldBe a [Right[_,_]]

    TestData.addMetric(TestData.randomMetricWith("composerId_fork1", "storyBundleId_fork1").copy(commissioningDesk = Some("testFilters")))
    TestData.addFork(TestData.randomForkWith("composerId_fork1", new DateTime("2017-01-01")).copy(timeToPublication = Some(1234)))

    TestData.addMetric(TestData.randomMetricWith("composerId_fork2", "storyBundleId_fork2").copy(commissioningDesk = Some("testFilters")))
    TestData.addFork(TestData.randomForkWith("composerId_fork2", new DateTime("2017-11-11")).copy(timeToPublication = Some(4321)))

    val getFilteredForks = metricsDb.getForks(Filters(desk = Some("testFilters")))
    getFilteredForks shouldBe a [Right[_,_]]

    val filteredResult = getFilteredForks.toOption.get
    filteredResult should have length 2

    val expectedResult: List[ForkResponse] = List(ForkResponse(new DateTime("2017-01-01"), 1234), ForkResponse(new DateTime("2017-11-11"), 4321))
    filteredResult should contain theSameElementsAs expectedResult
  }
}
