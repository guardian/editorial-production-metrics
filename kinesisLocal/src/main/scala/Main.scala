import models.{Composer, CreatedContent, KinesisEvent}

object Main {
  def main(args: Array[String]): Unit = {

    val event = KinesisEvent(CreatedContent, Some("1"), None, 100, 1, Composer)
    KinesisWriter.write(event)
  }
}