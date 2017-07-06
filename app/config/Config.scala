package config

import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import play.api.Configuration
import services.AwsInstanceTags

class Config(config: Configuration) extends AwsInstanceTags {

  val stage = readTag("Stage") getOrElse "DEV"
  val appName = readTag("App") getOrElse "editorial-production-metrics"
  val stack = readTag("Stack") getOrElse "flexible"
  val region = services.EC2Client.region

  val awsCredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
  )

  def getConfigString(key: String): String = config.getString(key)
    .getOrElse(throw new RuntimeException(s"key $key not found in configuration"))

  val elkKinesisStream = getConfigString("elk.kinesis.stream")
  val elkLoggingEnabled = config.getBoolean("elk.logging.enabled").getOrElse(true)

  val pandaDomain = getConfigString("panda.domain")
  val pandaAuthCallback = getConfigString("panda.authCallback")
  val pandaSystem = getConfigString("panda.system")

  val dbConfig = config.underlying.getConfig("ctx")

  val publishingMetricsKinesisStream = getConfigString("kinesis.publishingMetricsStream")

}
