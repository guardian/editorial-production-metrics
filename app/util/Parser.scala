package util

import cats.syntax.either._
import io.circe.{Json, parser}
import com.gu.editorialproductionmetricsmodels.models.{CapiData, KinesisEvent}
import models.ProductionMetricsError
import io.circe.generic.auto._
import org.joda.time.DateTime
import util.Utils._
import io.circe.parser._

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

  def listToJson(list: Seq[(DateTime, Int)]): Either[ProductionMetricsError, Json] = {
    val stringList = list.map { pair =>
      s"""{ "x": "${pair._1}", "y": ${pair._2}}"""
    }
    val stringToParse = "[" + stringList.mkString(",") + "]"

    parse(stringToParse).fold(processException, Right(_))
  }
  def jsonToCapiData(json: Json): Either[ProductionMetricsError, CapiData] =
    json.as[CapiData].fold(processException, Right(_))
}
