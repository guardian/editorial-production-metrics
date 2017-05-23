package controllers

import config.Config
import play.api.libs.ws.WSClient
import play.api.mvc._

class Login(val wsClient: WSClient, val config: Config) extends Controller with PanDomainAuthActions {

  def reauth = AuthAction {
    Ok("auth ok")
  }

  def oauthCallback = Action.async { implicit request =>
    processGoogleCallback()
  }
}
