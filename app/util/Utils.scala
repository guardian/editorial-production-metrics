package util

import io.circe.ParsingFailure
import models.{InvalidJsonError, NoRequestBodyError, ProductionMetricsError, UnexpectedExceptionError}
import play.api.Logger

object Utils {
  def processException(exception: Exception): Either[ProductionMetricsError, Nothing] = {
    val error = exception match {
      case e: ParsingFailure => InvalidJsonError(e.message)
      case _ => UnexpectedExceptionError
    }
    Logger.error(error.message, exception)
    Left(error)
  }

  def extractRequestBody(body: Option[String]): Either[ProductionMetricsError, String] =
    Either.cond(body.isDefined, body.get, NoRequestBodyError)
}