package util

import cats.syntax.either._
import io.circe.{Json, parser}
import Utils._
import models.{InCopyData, KinesisEvent, ProductionMetricsError}
import io.circe.generic.auto._
import org.joda.time.DateTime
import io.circe._, io.circe.parser._

object Parser {

  def stringToKinesisEvent(atomString: String): Either[ProductionMetricsError, KinesisEvent] = {
    for {
      json <- stringToJson(atomString)
      atom <- jsonToKinesisEvent(json)
    } yield atom
  }

  private def jsonToKinesisEvent(json: Json): Either[ProductionMetricsError, KinesisEvent] = {
    json.as[KinesisEvent].fold(processException, m => Right(m))
  }

  def stringToJson(json: String): Either[ProductionMetricsError, Json] = {
    val result = for {
      parsedJson <- parser.parse(json)
    } yield parsedJson
    result.fold(processException, Right(_))
  }

  def jsonToInCopyData(json: Json): Either[ProductionMetricsError, InCopyData] =
    json.as[InCopyData].fold(processException, Right(_))

  def listToJson(list: List[(DateTime, Long)]): Either[ProductionMetricsError, Json] = {
    val stringList = list.map { pair =>
      s"""{ "x": "${pair._1}", "y": ${pair._2}}"""
    }
    val stringToParse = "[" + stringList.mkString(",") + "]"

    parse(stringToParse).fold(processException, Right(_))
  }
}
