package util

import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem
import io.circe.{DecodingFailure, ParsingFailure}
import models._
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import play.api.Logger
import play.api.libs.ws.{WSClient, WSResponse}
import util.AsyncHelpers.await

import scala.concurrent.ExecutionContext.Implicits.global

object Utils {
  def processException(exception: Exception): Either[ProductionMetricsError, Nothing] = {
    val error = exception match {
      case e: ParsingFailure => InvalidJsonError(e.message)
      case e: DecodingFailure => InvalidJsonError(e.message)
      case _ => UnexpectedExceptionError
    }
    Logger.error(error.message, exception)
    Left(error)
  }

  def extractRequestBody(body: Option[String]): Either[ProductionMetricsError, String] =
    Either.cond(body.isDefined, body.get, NoRequestBodyError)

  def convertStringToDateTime(dateTime: String): Option[DateTime] = {
    val formatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    try {
      Some(formatter.parseDateTime(dateTime))
    }
    catch {
      case e: Throwable =>
        Logger.error(s"String $dateTime could not be converted to datetime. $e")
        None
    }
  }

  def extractOriginatingSystem(originatingSystem: String): Either[ProductionMetricsError, OriginatingSystem] =
    OriginatingSystem.withNameOption(originatingSystem).fold(Left(InvalidOriginatingSystem):Either[ProductionMetricsError, OriginatingSystem])(Right(_))

  def getTrackingTags(wsClient: WSClient, tagManagerUrl: String): Either[ProductionMetricsError, WSResponse] = await {
    wsClient.url(tagManagerUrl).withQueryString(List(("type", "Tracking"),("limit", "100")):_*).get
  }
}