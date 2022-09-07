package controllers

import com.gu.pandahmac.HMACAuthActions
import play.api.libs.ws.WSClient
import play.api.mvc._

class Login(val wsClient: WSClient, val controllerComponents: ControllerComponents, authActions: HMACAuthActions) extends BaseController {

  import authActions.{AuthAction, processOAuthCallback}

  def reauth = AuthAction {
    Ok("auth ok")
  }

  def oauthCallback = Action.async { implicit request =>
    processOAuthCallback()
  }
}
