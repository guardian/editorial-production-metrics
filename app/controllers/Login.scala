package controllers

import play.api.libs.ws.WSClient
import play.api.mvc._

class Login(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def reauth = AuthAction {
    Ok("auth ok")
  }

  def oauthCallback = Action.async { implicit request =>
    processGoogleCallback()
  }
}
