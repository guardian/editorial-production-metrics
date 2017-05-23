package controllers

import config.Config
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._

class App(val wsClient: WSClient, val config: Config) extends Controller with PanDomainAuthActions {

  def index = Action {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }
}
