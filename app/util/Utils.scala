package util

import io.circe.{DecodingFailure, ParsingFailure}
import models.{InvalidJsonError, NoRequestBodyError, ProductionMetricsError, UnexpectedExceptionError}
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import play.api.Logger

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
}