package config

import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.regions.Region
import play.api.Configuration
import services.AwsInstanceTags

class Config(config: Configuration) extends AwsInstanceTags {

  val stage: String = readTag("Stage") getOrElse "DEV"
  val appName: String = readTag("App") getOrElse "editorial-production-metrics"
  val stack: String = readTag("Stack") getOrElse "flexible"
  val region: Region = services.EC2Client.region

  val awsCredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
  )
  val elkKinesisStream: String = getConfigString("elk.kinesis.stream")
  val elkLoggingEnabled: Boolean = getConfigBoolean("elk.logging.enabled", Some(true))

  val pandaDomain: String = getConfigString("panda.domain")
  val pandaAuthCallback: String = getConfigString("panda.authCallback")
  val pandaSystem: String = getConfigString("panda.system")

  val publishingMetricsKinesisStream: String = getConfigString("kinesis.publishingMetricsStream")

  val tagManagerUrl = s"${getConfigString("tagManager.url", Some("http://tagmanager.gutools.co.uk"))}/hyper/tags"

//  This is for uniquely identifying the kinesis application when running the app locally on multiple DEV machines
  val devIdentifier: String = if(stage == "DEV") getConfigString("user") else ""

  val workflowUrl: String =  getConfigString("workflow.url")

  val hmacSecret: String = getConfigString("hmacSecret")

  private def getConfigString(key: String, default: Option[String] = None): String =
    config.getString(key).getOrElse(default.fold(throw new RuntimeException(s"String key $key not found in configuration"))(identity))

  private def getConfigBoolean(key: String, default: Option[Boolean] = None): Boolean =
    config.getBoolean(key).getOrElse(default.fold(throw new RuntimeException(s"Boolean key $key not found in configuration"))(identity))
}
