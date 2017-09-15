package util

import cats.syntax.either._
import com.gu.editorialproductionmetricsmodels.models.{CapiData, ForkData, KinesisEvent, MetricOpt}
import com.gu.editorialproductionmetricsmodels.models.MetricOpt._
import io.circe.generic.auto._
import io.circe.{Json, parser}
import models.db.Metric
import models.{CommissioningDesks, InvalidJsonError, ProductionMetricsError}
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

  def jsonToForkData(json: Json): Either[ProductionMetricsError, ForkData] = {
    json.as[ForkData].fold(processException, Right(_))
  }

  def extractMetricOpt(body: Option[String]): Either[ProductionMetricsError, MetricOpt] = body match {
    case Some(str) =>
      for {
        json <- stringToJson(str)
        metricOpt <- json.as[MetricOpt].fold(processException, m => Right(m))
      } yield metricOpt
    case None => Left(InvalidJsonError("The body of the request needs to be sent as Json"))
  }
}
