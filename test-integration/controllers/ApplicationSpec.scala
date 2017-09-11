package controllers

import java.util.UUID

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import database.MetricsDB
import helpers.PostgresHelpers
import models.db.Metric
import org.joda.time.DateTime
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FunSuite, Matchers}
import play.api.mvc.Results

class ApplicationSpec extends FunSuite with MockitoSugar with Matchers with Results with PostgresHelpers {
  implicit val metricsDb: MetricsDB = new MetricsDB()

  val testMetric = Metric(
    id = UUID.randomUUID().toString,
    composerId = Some(UUID.randomUUID().toString),
    originatingSystem = OriginatingSystem.Composer,
    creationTime = DateTime.now(),
    firstPublicationTime = Some(DateTime.now()))

  test("Application index endpoint") {
    metricsDb.upsertPublishingMetric(testMetric)

    metricsDb.getPublishingMetricsWithComposerId(testMetric.composerId) shouldBe testMetric
  }
}
