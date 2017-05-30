package controllers

import cats.syntax.either._
import config.Config
import database.MetricsDB
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import util.Utils._
import util.Parser._

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def index = Action {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }

  def createdInCopyContent = Action { req =>
    val x = for {
      body <- extractRequestBody(req.body.asJson.map(_.toString))
      json <- stringToJson(body)
      data <- jsonToInCopyData(json)
    } yield data
    Ok
  }
}
