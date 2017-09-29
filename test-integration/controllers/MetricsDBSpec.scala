package controllers

import com.gu.editorialproductionmetricsmodels.models.{MetricOpt, ProductionOffice}
import database.MetricsDB
import helpers.{PostgresHelpers, TestData}
import models.ProductionMetricsError
import models.db.{ForkResponse, Metric, MetricsFilters}
import org.joda.time.DateTime
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FunSuite, Matchers}
import play.api.mvc.Results

import scala.util.Right

class MetricsDBSpec extends FunSuite with MockitoSugar with Matchers with Results with PostgresHelpers {
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

  private[this] val testMetric: Metric = TestData.randomMetricWith("cId_upsert", "sbId_upsert")

  test("Upsert metric - insert metric") {
    val result: Either[ProductionMetricsError, Metric] = metricsDb.updateOrInsert(None, metricToMetricOpt(testMetric))
    result shouldBe a [Right[_,_]]

    val actualMetric = result.right.get
    val expectedMetric = testMetric.copy(id = actualMetric.id)
    actualMetric shouldBe expectedMetric
  }

  test("Upsert metric - update metric") {
    val updatedMetricOpt = metricToMetricOpt(testMetric).copy(
      commissioningDesk = Some("updatedCommissioningDesk"),
      productionOffice = None
    )
    val result: Either[ProductionMetricsError, Metric] = metricsDb.updateOrInsert(Some(testMetric), updatedMetricOpt)
    result shouldBe a [Right[_,_]]

    val actualMetric = result.right.get
    val expectedMetric = testMetric.copy(commissioningDesk = updatedMetricOpt.commissioningDesk)
    actualMetric shouldBe expectedMetric
  }

  test("Get forks with filter") {
    val getInitialForks = metricsDb.getForks(MetricsFilters())
    getInitialForks shouldBe a [Right[_,_]]

    TestData.addMetric(TestData.randomMetricWith("cId_fork1", "sbId_fork1").copy(commissioningDesk = Some("testFilters"), issueDate = Some(new DateTime("2017-01-01"))))
    TestData.addFork(TestData.randomForkWith("cId_fork1").copy(timeToPublication = Some(1234)))

    TestData.addMetric(TestData.randomMetricWith("cId_fork2", "sbId_fork2").copy(commissioningDesk = Some("testFilters"), issueDate = Some(new DateTime("2017-11-11"))))
    TestData.addFork(TestData.randomForkWith("cId_fork2").copy(timeToPublication = Some(4321)))

    val getFilteredForks = metricsDb.getForks(MetricsFilters(desk = Some("testFilters")))
    getFilteredForks shouldBe a [Right[_,_]]

    val filteredResult = getFilteredForks.right.get
    filteredResult should have length 2

    val expectedResult: List[ForkResponse] = List(ForkResponse(new DateTime("2017-01-01"), 1234), ForkResponse(new DateTime("2017-11-11"), 4321))
    filteredResult should contain theSameElementsAs expectedResult
  }
}
