import java.nio.ByteBuffer
import java.util.UUID

import Config._
import com.amazonaws.services.kinesis.model.PutRecordRequest
import com.amazonaws.services.kinesis.{AmazonKinesis, AmazonKinesisClient}
import io.circe.generic.auto._
import io.circe.syntax._
import models.KinesisEvent

object KinesisWriter {

  val client: AmazonKinesis = new AmazonKinesisClient(awsCredentialsProvider)
  client.setRegion(region)

  def write(event: KinesisEvent) = {
    val eventJson = event.asJson
    val eventString = eventJson.toString()
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
