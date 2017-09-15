package controllers

import cats.syntax.either._
import config.Config
import database.MetricsDB
import io.circe.generic.auto._
import io.circe.syntax._
import models.APIResponse
import models.db.{Fork, MetricsFilters}
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import util.CORSable
import util.Parser._
import util.Utils._

// Implicit
import models.db.CountResponse._

import scala.concurrent.ExecutionContext.Implicits.global

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def allowCORSAccess(methods: String, args: Any*) = CORSable(config.workflowUrl) {
    Action { implicit req =>
      val requestedHeaders = req.headers("Access-Control-Request-Headers")
      NoContent.withHeaders("Access-Control-Allow-Methods" -> methods, "Access-Control-Allow-Headers" -> requestedHeaders)
    }
  }

  def index = AuthAction {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }

  def getStartedIn(system: String) = APIAuthAction { req =>
    APIResponse {
      for {
        originatingSystem <- extractOriginatingSystem(system)
        filters = MetricsFilters(req.queryString).copy(originatingSystem = Some(originatingSystem))
        metric <- db.getGroupedByDayMetrics(filters)
      } yield metric
    }
  }

  def getWorkflowData(inWorkflow: Boolean) = APIAuthAction { req =>
    APIResponse {
      for {
        metric <- db.getGroupedByDayMetrics(MetricsFilters(req.queryString).copy(inWorkflow = Some(inWorkflow)))
      } yield metric
    }
  }

  def getCommissioningDeskList = APIAuthAction.async {
    val queryParams = List(("type", "Tracking"),("limit", "100"))
    wsClient.url(config.tagManagerUrl).withQueryString(queryParams:_*).get.map(
      response => stringToCommissioningDesks(response.body) match {
        case Right(desks) =>
          val deskNames = desks.data.map(desk => desk.data.path)
          Ok(deskNames.asJson.spaces4)
        case Left(_) => InternalServerError("Not able to parse json.")
      })
  }

  def upsertMetric() = CORSable(config.workflowUrl) {
    APIHMACAuthAction { req =>
      APIResponse {
        for {
          metricOpt <- extractMetricOpt(req.body.asJson.map(_.toString))
          metric <- db.updateOrInsert(db.getPublishingMetricsWithComposerId(metricOpt.composerId), metricOpt)
        } yield metric
      }
    }
  }

  def insertFork() = Action { req =>
    APIResponse {
      for {
        forkData <- extractForkData(req.body.asJson.map(_.toString))
        result <- db.insertFork(Fork(forkData))
      } yield result
    }
  }
}
