import com.gu.editorialproductionmetricsmodels.models.{KinesisEvent, _}
import io.circe.syntax._
import io.circe.{Json, parser}
import models.InvalidJsonError
import util.Parser

class ParserSuite extends BaseSuite {
  test("convert a string to a kinesis event") {
    val stringToParse = """{"eventType": "CapiContent", "eventJson": {}}"""
    val expectedJson: Json = parser.parse("{}") match {
      case Right(json) => json
      case _ => "".asJson
    }
    Parser.stringToKinesisEvent(stringToParse) should equal(Right(KinesisEvent(EventType.CapiContent, expectedJson)))
  }

  test("fail to convert a string to a kinesis event") {
    val stringToParse = """{"abcd": 123}"""
    Parser.stringToKinesisEvent(stringToParse).isLeft shouldBe true
    Parser.stringToKinesisEvent(stringToParse).left.get shouldBe a [InvalidJsonError]
  }
}
