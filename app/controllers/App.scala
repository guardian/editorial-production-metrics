package controllers

import config.Config
import database.MetricsDB
import io.circe.syntax._
import models.db.{MetricsFilters, OriginatingSystem}
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

  def getStartedIn(system: String) = AuthAction { req =>
    OriginatingSystem.withNameOption(system) match {
      case Some(s) =>
        implicit val filters = MetricsFilters(req.queryString).copy(originatingSystem = Some(s))

        listToJson(db.getStartedInSystem) match {
          case Right(j) => Ok(j.asJson.spaces4)
          case Left(_) => InternalServerError("Not able to parse json")
        }
      case None => BadRequest("The valid values for starting system are: composer and incopy")
    }

  }
}
