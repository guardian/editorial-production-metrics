package util

import cats.syntax.either._
import io.circe.{Json, parser}
import Utils._
import models.{InCopyData, ProductionMetricsError}
import io.circe.generic.auto._

object Parser {

  def stringToJson(json: String): Either[ProductionMetricsError, Json] = {
    val result = for {
      parsedJson <- parser.parse(json)
    } yield parsedJson
    result.fold(processException, Right(_))
  }

  def jsonToInCopyData(json: Json): Either[ProductionMetricsError, InCopyData] =
    json.as[InCopyData].fold(processException, Right(_))

}
