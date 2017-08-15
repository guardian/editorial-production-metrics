import com.gu.editorialproductionmetricsmodels.models.{KinesisEvent, _}
import io.circe.{Json, parser}
import io.circe.syntax._
import models.UnexpectedExceptionError
import org.scalatestplus.play._
import util.Parser

class ParserSpec extends PlaySpec {
  "Parser" should {
    "convert a string to a kinesis event" in {
      val stringToParse = """{"eventType": "CapiContent", "eventJson": {}}"""
      val expectedJson: Json = parser.parse("{}") match {
        case Right(json) => json
        case _ => "".asJson
      }
      Parser.stringToKinesisEvent(stringToParse) mustBe Right(KinesisEvent(EventType.CapiContent, expectedJson))
    }

    "fail to convert a string to a kinesis event" in {
      val stringToParse = """{"abcd": 123}"""
      Parser.stringToKinesisEvent(stringToParse) mustBe Left(UnexpectedExceptionError)
    }
  }
}
