package models

import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import models.db.WordCountResponse
import play.api.Logger
import play.api.mvc._

case class WordCountAPIResponse(artcilesWithoutCommissionedLength: List[WordCountResponse],
                                articlesWithWordCountResponse: List[WordCountResponse],
                                resultsOmitted: Boolean)

object WordCountAPIResponse {
  implicit val wordCountApiResponseEncoder: Encoder[WordCountAPIResponse] = deriveEncoder[WordCountAPIResponse]
}

case class MetricsAPIResponse(message: String)
object MetricsAPIResponse{
  implicit val metricsApiResponseEncoder: Encoder[MetricsAPIResponse] = deriveEncoder[MetricsAPIResponse]
}

object APIResponse extends Results {
  def apiErrorToResult(e: ProductionMetricsError) = {
    Logger.error(e.message)
    InternalServerError(MetricsAPIResponse(e.message).asJson.noSpaces)
  }

  def apply[T](result: Either[ProductionMetricsError, T])(implicit encoder: Encoder[T]): Result = {
    val res = result.fold(apiErrorToResult, r => Ok(r.asJson.noSpaces))
    res.as("text/json")
  }
}