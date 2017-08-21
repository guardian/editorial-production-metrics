package controllers

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import config.Config
import database.MetricsDB
import io.circe.Decoder.Result
import io.circe.generic.auto._
import io.circe.syntax._
import models.db.CountResponse._
import models.db.{Metric, MetricsFilters}
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import util.CORSable
import util.Parser._

import scala.concurrent.ExecutionContext.Implicits.global

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def allowCORSAccess(methods: String, args: Any*) = CORSable(config.workflowUrl) {
    Action { implicit req =>
      println("allow cors", args)
      val requestedHeaders = req.headers("Access-Control-Request-Headers")
      NoContent.withHeaders("Access-Control-Allow-Methods" -> methods, "Access-Control-Allow-Headers" -> requestedHeaders)
    }
  }

  def index = AuthAction {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }

  def getStartedIn(system: String) = AuthAction { req =>
    OriginatingSystem.withNameOption(system) match {
      case Some(s) =>
        implicit val filters = MetricsFilters(req.queryString).copy(originatingSystem = Some(s))
        Ok(db.getStartedInSystem.asJson.spaces4)
      case None => BadRequest("The valid values for originating system are: composer and incopy")
    }
  }

  def getCommissioningDeskList = Action.async {
    val queryParams = List(("type", "Tracking"),("limit", "100"))
    wsClient.url(config.tagManagerUrl).withQueryString(queryParams:_*).get.map(
      response => stringToCommissioningDesks(response.body) match {
        case Right(desks) =>
          val deskNames = desks.data.map(desk => desk.data.path)
          Ok(deskNames.asJson.spaces4)
        case Left(_) => InternalServerError("Not able to parse json.")
      })
  }

  def saveMetric() = //CORSable(config.workflowUrl) {
    Action { req =>
      req.body.asJson.map(_.toString) match {
        case Some(metricOptString) =>
//          val result = for {
//            metricOptJson <- stringToJson(metricOptString)
//            composerId = metricOptJson.hcursor.downField("composerId").as[String]
//          } yield metricOptJson
//
//          Ok(result.asJson.spaces4)


          stringToJson(metricOptString).fold(
            err => InternalServerError(err.message),
            metricOptJson => {
              metricOptJson.hcursor.downField("composerId").as[String].fold(
                _ => BadRequest("No composerId provided."),
                composerId =>
                  db.getPublishingMetricsWithComposerId(Some(composerId)) match {
                    case Some(metric) =>
                      Metric.updateMetric(metric, metricOptJson).fold(
                        err => InternalServerError(err.message),
                        updated => {
                          db.upsertPublishingMetric(updated)
                          println(updated)
                          Ok(updated.asJson.spaces4)
                        })
                    case None => NotFound(s"Resource with composerId $composerId not found in the database.")
                  }
              )
            }
          )
        case None => BadRequest("The body of the request needs to be Json")
      }
    }
//  }
}
