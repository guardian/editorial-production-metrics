import com.gu.editorialproductionmetricsmodels.models.EventType.CapiContent
import com.gu.editorialproductionmetricsmodels.models.OriginatingSystem.InCopy
import com.gu.editorialproductionmetricsmodels.models.{CapiData, KinesisEvent, ProductionOffice}
import io.circe.syntax._
import io.circe.generic.auto._

object Main {
  def main(args: Array[String]): Unit = {
    val testCapiData = CapiData(
      composerId = "testing123",
      storyBundleId = None,
      newspaperBookTag = None,
      creationDate = "2017-10-11T23:22:17Z",
      firstPublicationDate = "2017-10-11T23:22:17Z",
      commissioningDesk = "news",
      originatingSystem = InCopy,
      productionOffice = Some(ProductionOffice.Uk))
    val event = KinesisEvent(CapiContent, testCapiData.asJson)
    KinesisWriter.write(event)
  }
}