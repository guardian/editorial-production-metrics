package lib.kinesis

import java.util.concurrent.atomic.{AtomicInteger, AtomicLong}
import java.util.{List => JList}

import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorCheckpointer}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.ShutdownReason
import com.amazonaws.services.kinesis.model.Record
import com.gu.editorialproductionmetricsmodels.models.KinesisEvent
import lib.kinesis.EventProcessor.EventWithSize
import models.ProductionMetricsError
import play.api.Logger
import util.Parser._

import scala.collection.JavaConverters._
import scala.concurrent.duration._

abstract class EventProcessor[T <: KinesisEvent](
  checkpointInterval: Duration = 30.seconds,
  maxCheckpointBatchSize: Int = 20)
  extends IRecordProcessor {

  def isActivated: Boolean

  private[this] var shardId: String = _

  /* Use atomic to prevent any concurrent access issues */
  private[this] val lastCheckpointedAt = new AtomicLong(System.nanoTime())
  private[this] val recordsProcessedSinceCheckpoint = new AtomicInteger()

  override def initialize(shardId: String): Unit = {
    this.shardId = shardId
    Logger.info(s"Initialized an event processor for shard $shardId")
  }

  override def processRecords(records: JList[Record], checkpointer: IRecordProcessorCheckpointer): Unit = {
    if (isActivated) {
      processRecordsIfActivated(records, checkpointer)
    } else {
      /* do not process any event */
    }
  }

  def deserializeEvent(data: Array[Byte]): Either[ProductionMetricsError, KinesisEvent] ={
    val jsonAsString = new String(data)
    stringToKinesisEvent(jsonAsString)
  }

  private def processRecordsIfActivated(records: JList[Record], checkpointer: IRecordProcessorCheckpointer): Unit = {
    val events = records.asScala.flatMap { record =>
      val buffer = record.getData.array
      deserializeEvent(buffer) match {
        case Right(event) => Some(EventWithSize(event, buffer.length))
        case Left(error) =>
          Logger.error(error.message)
          None
      }
    }

    processEvents(events)

    /* increment the record counter */
    recordsProcessedSinceCheckpoint.addAndGet(events.size)

    if (shouldCheckpointNow) {
      checkpoint(checkpointer)
    }
  }

  protected def processEvents(events: Seq[EventWithSize[KinesisEvent]]): Unit

  /* Checkpoint after every X seconds or every Y records */
  private def shouldCheckpointNow =
    recordsProcessedSinceCheckpoint.get() >= maxCheckpointBatchSize ||
      lastCheckpointedAt.get() < System.nanoTime() - checkpointInterval.toNanos

  private def checkpoint(checkpointer: IRecordProcessorCheckpointer) = {
    /* Store our latest position in the stream */
    checkpointer.checkpoint()

    /* Reset the counters */
    lastCheckpointedAt.set(System.nanoTime())
    recordsProcessedSinceCheckpoint.set(0)
  }

  /* This method may be called by KCL, e.g. in case of shard splits/merges */
  override def shutdown(checkpointer: IRecordProcessorCheckpointer, reason: ShutdownReason): Unit = {
    if (reason == ShutdownReason.TERMINATE) {
      checkpointer.checkpoint()
    }
    Logger.info(s"Shutdown event processor for shard $shardId because $reason")
  }

}

trait SingleEventProcessor[T <: KinesisEvent] extends EventProcessor[T] {

  override protected def processEvents(events: Seq[EventWithSize[KinesisEvent]]) = events foreach processEvent
  protected def processEvent(eventWithSize: EventWithSize[KinesisEvent]): Unit

}

object EventProcessor {

  case class EventWithSize[T](event: T, eventSize: Int)

}

