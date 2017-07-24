package controllers

import config.Config
import database.MetricsDB
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def index = AuthAction {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }
}
