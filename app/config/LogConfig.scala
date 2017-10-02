package config

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.classic.{Logger => LogbackLogger}
import ch.qos.logback.core.{Appender, LayoutBase}
import com.google.inject.AbstractModule
import com.gu.logback.appender.kinesis.KinesisAppender
import config.Config._
import net.logstash.logback.layout.LogstashLayout
import org.slf4j.{LoggerFactory, Logger => SLFLogger}
import play.api.Logger

class LogConfig extends AbstractModule {

  val rootLogger: LogbackLogger = LoggerFactory.getLogger(SLFLogger.ROOT_LOGGER_NAME).asInstanceOf[LogbackLogger]

  def configure {
    rootLogger.info("bootstrapping kinesis appender if configured correctly")

    Logger.info(s"bootstrapping kinesis appender with $stack -> $appName -> $stage -> $elkKinesisStream")
    val context = rootLogger.getLoggerContext

    val layout = new LogstashLayout()
    layout.setContext(context)
    layout.setCustomFields(s"""{"stack":"$stack","app":"$appName","stage":"$stage"}""")
    layout.start()

    val appender = new KinesisAppender()
    appender.setBufferSize(1000)
    appender.setRegion(region.toString)
    appender.setStreamName(elkKinesisStream)
    appender.setContext(context)
    appender.setLayout(layout.asInstanceOf[LayoutBase[Nothing]])
    appender.setCredentialsProvider(awsCredsProvider)

    appender.start()

    rootLogger.addAppender(appender.asInstanceOf[Appender[ILoggingEvent]])
    rootLogger.info("Configured kinesis appender")
  }
  if (elkLoggingEnabled) {
    configure
  }

}