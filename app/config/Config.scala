package config

import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import play.api.Configuration
import services.AwsInstanceTags
import com.gu.cm.{Mode, Configuration => ConfigurationMagic}

object Config extends AwsInstanceTags {

  val stage = readTag("Stage") getOrElse "DEV"
  val appName = readTag("App") getOrElse "editorial-production-metrics"
  val stack = readTag("Stack") getOrElse "flexible"
  val region = services.EC2Client.region

  val awsCredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
  )

  val configMagicMode = stage match {
    case "DEV" => Mode.Dev
    case "CODE" => Mode.Prod
    case "PROD" => Mode.Prod
    case _ => sys.error("invalid stage")
  }
  val config = ConfigurationMagic(appName, configMagicMode).load

  def getOptionalProperty[T](path: String, getVal: String => T) = {
    if (config.hasPath(path)) Some(getVal(path))
    else None
  }

  val elkKinesisStream = config.getString("elk.kinesis.stream")
  val elkLoggingEnabled = getOptionalProperty("elk.logging.enabled", config.getBoolean).getOrElse(true)

  val pandaDomain = config.getString("panda.domain")
  val pandaAuthCallback = config.getString("panda.authCallback")
  val pandaSystem = config.getString("panda.system")

}
