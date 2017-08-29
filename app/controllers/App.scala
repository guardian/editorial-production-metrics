package controllers

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import config.Config
import database.MetricsDB
import io.circe.generic.auto._
import io.circe.syntax._
import models.db.MetricsFilters
import models.db.CountResponse._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import util.Parser._

import scala.concurrent.ExecutionContext.Implicits.global

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

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
}
