import com.gu.editorialproductionmetricsmodels.models.EventType.CapiContent
import com.gu.editorialproductionmetricsmodels.models.{CapiData, KinesisEvent}
import io.circe.syntax._
import io.circe.generic.auto._

object Main {
  def main(args: Array[String]): Unit = {

    val testCapiData = CapiData("xyz12341", None, None, "2017-07-20T13:00:06Z", "sport", "incopy")
    val event = KinesisEvent(CapiContent, testCapiData.asJson)
    KinesisWriter.write(event)
  }
}