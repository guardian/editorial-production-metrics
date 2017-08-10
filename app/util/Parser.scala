package util

import cats.syntax.either._
import io.circe.{Json, parser}
import com.gu.editorialproductionmetricsmodels.models.{CapiData, KinesisEvent}
import models.{ProductionMetricsError, CommissioningDesks}
import util.Utils._
import io.circe.parser._
import io.circe.generic.auto._

object Parser {

  def stringToKinesisEvent(atomString: String): Either[ProductionMetricsError, KinesisEvent] = {
    for {
      json <- stringToJson(atomString)
      event <- jsonToKinesisEvent(json)
    } yield event
  }

  def stringToCommissioningDesks(tagsString: String): Either[ProductionMetricsError, CommissioningDesks] = {
    for {
      json <- stringToJson(tagsString)
      tags <- jsonToCommissioningDesks(json)
    } yield tags
  }

  private def jsonToCommissioningDesks(json: Json): Either[ProductionMetricsError, CommissioningDesks] = {
    json.as[CommissioningDesks].fold(processException, m => Right(m))
  }

  private def jsonToKinesisEvent(json: Json): Either[ProductionMetricsError, KinesisEvent] = {
    json.as[KinesisEvent].fold(processException, m => Right(m))
  }

  def jsonToCapiData(json: Json): Either[ProductionMetricsError, CapiData] =
    json.as[CapiData].fold(processException, Right(_))

  def stringToJson(json: String): Either[ProductionMetricsError, Json] = {
    val result = for {
      parsedJson <- parser.parse(json)
    } yield parsedJson
    result.fold(processException, Right(_))
  }

  def listToJson(list: Seq[(Long, Int)]): Either[ProductionMetricsError, Json] = {
    val stringList = list.map { pair =>
      s"""{ "x": ${pair._1}, "y": ${pair._2}}"""
    }
    val stringToParse = "[" + stringList.mkString(",") + "]"

    parse(stringToParse).fold(processException, Right(_))
  }
}
