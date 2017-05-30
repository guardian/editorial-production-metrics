package util

import io.circe.ParsingFailure
import models.{InvalidJsonError, NoRequestBodyError, ProductionMetricsError, UnexpectedExceptionError}

object Utils {

  def processException(exception: Exception): Either[ProductionMetricsError, Nothing] = {
    val error = exception match {
      case e: ParsingFailure => InvalidJsonError(e.message)
      case _ => UnexpectedExceptionError
    }
    Left(error)
  }

  def extractRequestBody(body: Option[String]): Either[ProductionMetricsError, String] =
    Either.cond(body.isDefined, body.get, NoRequestBodyError)

}
