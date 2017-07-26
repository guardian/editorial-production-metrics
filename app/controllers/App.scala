package controllers

import config.Config
import database.MetricsDB
import models.db.{ComposerMetric, MetricsFilters$, Metric}
import models.db.Metric._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import io.circe.syntax._

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def index = AuthAction {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }

  def getComposerContent = AuthAction { req =>
    implicit val filters = MetricsFilters(req.queryString)
    val result = db.getPublishingMetrics
    println("res", result)
    Ok(result.asJson.spaces4)
  }
}
