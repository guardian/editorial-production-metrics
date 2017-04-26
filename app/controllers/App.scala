package controllers

import config.Config
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._

class App(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def index = AuthAction {
    Logger.info(s"I am the ${Config.appName}")
    Ok(views.html.index())
  }
}
