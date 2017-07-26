package controllers

import config.Config
import database.MetricsDB
import io.circe.syntax._
import models.db.MetricsFilters
import org.joda.time.DateTime
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import util.Parser.listToJson

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def index = AuthAction {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }

  def getStartedInComposer = AuthAction { req =>
    implicit val filters = MetricsFilters(req.queryString)
    val result: List[(DateTime, Long)] = db.getStartedIn("composer")

    listToJson(result) match {
      case Right(j) => Ok(j.asJson.spaces4)
      case Left(_) => InternalServerError("Not able to parse json")
    }
  }

  def getStartedInInCopy = AuthAction { req =>
    implicit val filters = MetricsFilters(req.queryString)
    val result: List[(DateTime, Long)] = db.getStartedIn("incopy")

    listToJson(result) match {
      case Right(j) => Ok(j.asJson.spaces4)
      case Left(_) => InternalServerError("Not able to parse json")
    }
  }
}
