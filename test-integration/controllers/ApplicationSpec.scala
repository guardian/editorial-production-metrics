package controllers

import database.MetricsDB
import helpers.PostgresHelpers
import org.scalatest.mock.MockitoSugar
import org.scalatestplus.play._
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers._

class ApplicationSpec extends PlaySpec with Results with MockitoSugar with PostgresHelpers {
  implicit val wsClient: WSClient = mock[WSClient]
  implicit val metricsDb: MetricsDB = mock[MetricsDB]

  "App#index" should {
    "return 200" in {
      val controller = new Application()
      val result = controller.index.apply(FakeRequest())
      status(result) mustBe 200
    }
  }
}
