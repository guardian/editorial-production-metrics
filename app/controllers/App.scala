package controllers

import java.util.UUID

import cats.syntax.either._
import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import config.Config
import database.MetricsDB
import io.circe.generic.auto._
import io.circe.syntax._
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
    OriginatingSystem.withNameOption(system) match {
      case Some(s) =>
        implicit val filters = MetricsFilters(req.queryString).copy(originatingSystem = Some(s))
        Ok(db.getGroupedByDayMetrics.asJson.spaces4)
      case None => BadRequest("The valid values for originating system are: composer and incopy")
    }
  }

  def getWorkflowData(inWorkflow: Boolean) = APIAuthAction { req =>
    implicit val filters = MetricsFilters(req.queryString).copy(inWorkflow = Some(inWorkflow))
    Ok(db.getGroupedByDayMetrics.asJson.spaces4)
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
      req.body.asJson.map(_.toString) match {
        case Some(metricOptString) =>
          val result = for {
            metricOptJson <- stringToJson(metricOptString)
            composerId <- metricOptJson.hcursor.downField("composerId").as[String].fold(processException, cId => Right(cId))
            metric <- db.updateOrInsert(db.getPublishingMetricsWithComposerId(Some(composerId)), metricOptJson)
          } yield metric
          result.fold(
            err => {
              Logger.error(s"An error occurred while posting the metric: ${err.message}")
              InternalServerError(s"An error occurred while posting the metric: ${err.message}")
            },
            r => Ok(r.asJson.spaces4))
        case None => BadRequest("The body of the request needs to be sent as Json")
      }
    }
  }

  def insertFork() = APIHMACAuthAction { req =>
    req.body.asJson.map(_.toString) match {
      case Some(forkString) =>
        val result = for {
          forkJson <- stringToJson(forkString)
          forkData <- jsonToForkData(forkJson)
          fork = Fork(id = UUID.randomUUID.toString, forkData.composerId, forkData.time, forkData.wordCount, forkData.revisionNumber)
        } yield db.insertFork(fork)
        result.fold(
          err => {
            Logger.error(s"An error occurred while posting the fork: ${err.message}")
            InternalServerError(s"An error occurred while posting the fork: ${err.message}")
          },
          _ => Ok("Saved fork data"))
      case None => BadRequest("The body of the request needs to be sent as Json")
    }
  }
}
