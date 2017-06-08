import java.nio.ByteBuffer
import java.util.UUID

import com.amazonaws.services.kinesis.{AmazonKinesis, AmazonKinesisClient}
import Config._
import com.amazonaws.services.kinesis.model.PutRecordRequest
import models.KinesisEvent
import play.api.libs.json.Json

object KinesisWriter {

  val client: AmazonKinesis = new AmazonKinesisClient(awsCredentialsProvider)
  client.setRegion(region)

  def write(event: KinesisEvent) = {
    val eventJson = Json.toJson(event)
    val eventString = Json.stringify(eventJson)
    postToKinesis(eventString)
  }

  def postToKinesis(event: String) = {
    val streamEvent: ByteBuffer = ByteBuffer.wrap(event.getBytes)

    val partitionKey = UUID.randomUUID().toString
    val request: PutRecordRequest = new PutRecordRequest()
    request.setPartitionKey(partitionKey)
    request.setStreamName(streamName)
    request.setData(streamEvent)
    client.putRecord(request)
  }
}