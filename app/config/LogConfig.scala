package config

import ch.qos.logback.classic.{Logger => LogbackLogger}
import net.logstash.logback.layout.LogstashLayout
import org.slf4j.{LoggerFactory, Logger => SLFLogger}
import com.gu.logback.appender.kinesis.KinesisAppender
import play.api.Logger

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.{Appender, LayoutBase}
import com.google.inject.AbstractModule


class LogConfig extends AbstractModule {

  val rootLogger = LoggerFactory.getLogger(SLFLogger.ROOT_LOGGER_NAME).asInstanceOf[LogbackLogger]

  def configure {
    rootLogger.info("bootstrapping kinesis appender if configured correctly")
    val stack = Config.stack
    val app = Config.appName
    val stage = Config.stage

    Logger.info(s"bootstrapping kinesis appender with $stack -> $app -> $stage -> ${Config.elkKinesisStream}")
    val context = rootLogger.getLoggerContext

    val layout = new LogstashLayout()
    layout.setContext(context)
    layout.setCustomFields(s"""{"stack":"$stack","app":"$app","stage":"$stage"}""")
    layout.start()

    val appender = new KinesisAppender()
    appender.setBufferSize(1000)
    appender.setRegion(Config.region.toString)
    appender.setStreamName(Config.elkKinesisStream)
    appender.setContext(context)
    appender.setLayout(layout.asInstanceOf[LayoutBase[Nothing]])
    appender.setCredentialsProvider(Config.awsCredentialsProvider)

    appender.start()

    rootLogger.addAppender(appender.asInstanceOf[Appender[ILoggingEvent]])
    rootLogger.info("Configured kinesis appender")
  }
  if (Config.elkLoggingEnabled) {
    configure
  }

}