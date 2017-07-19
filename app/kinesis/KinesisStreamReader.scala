package lib.kinesis

import java.util.UUID
import java.util.concurrent.Executors

import com.amazonaws.auth.AWSCredentialsProvider
import com.amazonaws.services.kinesis.clientlibrary.interfaces.IRecordProcessorFactory
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.{InitialPositionInStream, KinesisClientLibConfiguration, Worker}
import com.amazonaws.services.kinesis.metrics.impl.NullMetricsFactory
import com.google.common.util.concurrent.ThreadFactoryBuilder
import config.Config

trait KinesisStreamReader {

  val streamName: String
  val stage: String
  val kinesisCredentialsProvider: AWSCredentialsProvider
  val dynamoCredentialsProvider: AWSCredentialsProvider
  val config: Config

  /* This application name is used by KCL to store the checkpoint data
   * about how much of the stream we have consumed. The application
   * name should be unique for each stream and be less than 255
   * characters. */
  lazy val applicationName: String = s"${streamName}_editorial_production_metrics_$stage"

  /* only applies when there are no checkpoints */
  val initialPosition = InitialPositionInStream.LATEST

  /* Unique ID for the worker thread */
  private val workerId = UUID.randomUUID().toString

  private lazy val kinesisConfig =
    new KinesisClientLibConfiguration(applicationName, streamName, kinesisCredentialsProvider, dynamoCredentialsProvider, null, workerId)
      .withInitialPositionInStream(initialPosition)
      .withRegionName(config.region.getName)
      .withInitialLeaseTableReadCapacity(10)
      .withInitialLeaseTableWriteCapacity(10)

  protected val eventProcessorFactory: IRecordProcessorFactory

  /* Create a worker, which will in turn create one or more EventProcessors */
  lazy val worker = new Worker(
    eventProcessorFactory,
    kinesisConfig,
    new NullMetricsFactory(), // don't send metrics to CloudWatch because it's expensive and not very helpful
    Executors.newCachedThreadPool(new ThreadFactoryBuilder().setNameFormat(s"${getClass.getSimpleName}-$workerId-thread-%d").build())
  )

  /* Start the worker in a new thread. It will run forever */
  private lazy val workerThread =
    new Thread(worker, s"${getClass.getSimpleName}-$workerId")


  def start(): Unit = workerThread.start()

}
