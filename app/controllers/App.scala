package controllers

import cats.syntax.either._
import config.Config
import database.MetricsDB
import org.joda.time.DateTime
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import util.Utils._
import util.Parser._

class App(val wsClient: WSClient, val config: Config, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def index = AuthAction {
    Logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }

  def startedInComposer(desk: Option[String], startDate: Option[String], endDate: Option[String]) = Action {
    println(convertStringToDate(startDate))
    Ok
  }

  def createdInCopyContent = AuthAction { req =>
    val x = for {
      body <- extractRequestBody(req.body.asJson.map(_.toString))
      json <- stringToJson(body)
      data <- jsonToInCopyData(json)
    } yield data
    Ok
  }

  private def convertStringToDate(date: Option[String]): Option[DateTime] = {
    date match {
      case Some(d) => Some(new DateTime(d))
      case _ => None
    }
  }
}
