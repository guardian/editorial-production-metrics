package models.db

import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import org.joda.time.{DateTimeZone, DateTime}

case class ArticleWordCountResponse(headline: Option[String], path: Option[String], wordCount: Option[Int], commissionedWordLength: Option[Int])
object ArticleWordCountResponse {
  implicit val articleWordCountResponseEncoder: Encoder[ArticleWordCountResponse] = deriveEncoder[ArticleWordCountResponse]
}

case class GroupedWordCount(countRange: (Int, Option[Int]), count: Int)

object GroupedWordCount {
  implicit val groupedWordCountApiResponseEncoder: Encoder[GroupedWordCount] =
    deriveEncoder[GroupedWordCount]
}

case class ForkResponse(issueDate: DateTime, timeToPublication: Int)

object ForkResponse {

  def convertToForkResponse(pair : (Option[Int], DateTime)) = {

    val (timeToPublicationOpt, forkTime) = pair

    timeToPublicationOpt.map(timeToPublication => ForkResponse(forkTime, timeToPublication))
  }
}

case class CountResponse(date: DateTime, count: Int)
object CountResponse {
  private val datePattern = "yyyy-MM-dd'T'HH:mm:ss'Z'"

  implicit val timeEncoder = new Encoder[DateTime] {
    def apply(d: DateTime) = d.withZone(DateTimeZone.UTC).toString(datePattern).asJson
  }
  implicit val metricEncoder: Encoder[Metric] = deriveEncoder
}

