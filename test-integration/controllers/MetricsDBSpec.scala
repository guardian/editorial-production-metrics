package controllers

import java.util.UUID

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import database.MetricsDB
import helpers.PostgresHelpers
import models.ProductionMetricsError
import models.db.Metric
import org.joda.time.DateTime
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FunSuite, Matchers}
import play.api.mvc.Results

class MetricsDBSpec extends FunSuite with MockitoSugar with Matchers with Results with PostgresHelpers {
  implicit val metricsDb: MetricsDB = new MetricsDB()

  val testMetric = Metric(
    id = UUID.randomUUID().toString,
    composerId = Some("composerid"),
    originatingSystem = OriginatingSystem.Composer,
    creationTime = DateTime.now(),
    firstPublicationTime = None)

  test("Upsert new metric") {
    val result: Either[ProductionMetricsError, Metric] = metricsDb.upsertPublishingMetric(testMetric)

    result.right.get shouldBe testMetric
  }
}
