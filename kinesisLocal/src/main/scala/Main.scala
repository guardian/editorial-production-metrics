import models.{CapiContent, CapiData, KinesisEvent}
import play.api.libs.json.Json

object Main {
  def main(args: Array[String]): Unit = {

    val testCapiData = CapiData("xyz1234", None, None, "2017-07-20T13:00:06Z", "sport", "incopy")
    val event = KinesisEvent(CapiContent, Json.toJson(testCapiData))
    KinesisWriter.write(event)
  }
}