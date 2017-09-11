package controllers

import database.MetricsDB
import helpers.PostgresHelpers
import org.scalatest.{FunSuite, Matchers}
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers._
import org.scalatest.mockito.MockitoSugar

class ApplicationSpec extends FunSuite with MockitoSugar with Matchers with Results with PostgresHelpers {
  implicit val wsClient: WSClient = mock[WSClient]
  implicit val metricsDb: MetricsDB = mock[MetricsDB]

    test("Application index endpoint") {
      val controller = new Application()
      val result = controller.index.apply(FakeRequest())
      status(result) should equal(200)
    }
}
