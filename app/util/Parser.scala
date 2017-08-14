package util

import cats.syntax.either._
import com.gu.editorialproductionmetricsmodels.models.{CapiData, KinesisEvent}
import io.circe.generic.auto._
import io.circe.{Json, parser}
import models.{CommissioningDesks, ProductionMetricsError}
import util.Utils._

object Parser {

  def stringToKinesisEvent(atomString: String): Either[ProductionMetricsError, KinesisEvent] = {
    for {
      json <- stringToJson(atomString)
      event <- jsonToKinesisEvent(json)
    } yield event
  }

  private def jsonToKinesisEvent(json: Json): Either[ProductionMetricsError, KinesisEvent] = {
    json.as[KinesisEvent].fold(processException, m => Right(m))
  }

  def stringToCommissioningDesks(tagsString: String): Either[ProductionMetricsError, CommissioningDesks] = {
    for {
      json <- stringToJson(tagsString)
      tags <- jsonToCommissioningDesks(json)
    } yield tags
  }

  private def stringToJson(json: String): Either[ProductionMetricsError, Json] = {
    val result = for {
      parsedJson <- parser.parse(json)
    } yield parsedJson
    result.fold(processException, Right(_))
  }

  private def jsonToCommissioningDesks(json: Json): Either[ProductionMetricsError, CommissioningDesks] = {
    json.as[CommissioningDesks].fold(processException, m => Right(m))
  }

  def jsonToCapiData(json: Json): Either[ProductionMetricsError, CapiData] =
    json.as[CapiData].fold(processException, Right(_))
}
