package util

import com.gu.editorialproductionmetricsmodels.models.MetricOpt._
import com.gu.editorialproductionmetricsmodels.models.{CapiData, KinesisEvent, MetricOpt}
import io.circe.generic.auto._
import io.circe.{Decoder, Json, parser}
import models.db.Metric
import models.db.Metric._
import models.{CommissioningDesks, ProductionMetricsError}
import play.api.Logger
import util.Utils._

object Parser {

  def stringToKinesisEvent(atomString: String): Either[ProductionMetricsError, KinesisEvent] = for {
    json <- stringToJson(atomString)
    event <- jsonToKinesisEvent(json)
  } yield event

  private def jsonToKinesisEvent(json: Json): Either[ProductionMetricsError, KinesisEvent] =
    json.as[KinesisEvent].fold(processException, m => Right(m))

  def jsonToMetric(json: Json): Either[ProductionMetricsError, Metric] =
    json.as[Metric].fold(processException, m => Right(m))

  def jsonToMetricOpt(json: Json): Either[ProductionMetricsError, MetricOpt] =
    json.as[MetricOpt].fold(err => {
      Logger.error(s"Json parsing failed for $json with error: ${err.message}")
      processException(err)
    }, m => Right(m))

  def stringToCommissioningDesks(tagsString: String): Either[ProductionMetricsError, CommissioningDesks] = for {
    json <- stringToJson(tagsString)
    tags <- jsonToCommissioningDesks(json)
  } yield tags

  def stringToJson(jsonString: String): Either[ProductionMetricsError, Json] = {
    val result = for {
      parsedJson <- parser.parse(jsonString)
    } yield parsedJson
    result.fold(processException, Right(_))
  }

  private def jsonToCommissioningDesks(json: Json): Either[ProductionMetricsError, CommissioningDesks] =
    json.as[CommissioningDesks].fold(processException, m => Right(m))

  def jsonToCapiData(json: Json): Either[ProductionMetricsError, CapiData] =
    json.as[CapiData].fold(processException, Right(_))

  def extractFromString[A](str: String)(implicit decoder: Decoder[A]): Either[ProductionMetricsError, A] =
    for {
      json <- stringToJson(str)
      result <- json.as[A].fold(processException, m => Right(m))
    } yield result

}
