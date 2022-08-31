package config

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import com.typesafe.config.Config
import play.api.Configuration
import services.AwsInstanceTags

class AppConfig(playConfig: Configuration, identity: AppIdentity) extends AwsInstanceTags {
  val config: Config = playConfig.underlying

  val (appName, stage, stack, region) = identity match {
    case aws: AwsIdentity => (aws.app, aws.stage, aws.stack, aws.region)
    case dev: DevIdentity => (dev.app, "DEV", "flexible", "eu-west-1")
  }

  val kinesisAwsCredentials = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
  )

  val pandaAwsCredentials: AWSCredentialsProvider =
    new AWSCredentialsProviderChain(
      new ProfileCredentialsProvider(getPropertyWithDefault("panda.awsCredsProfile", config.getString, "panda")),
      new InstanceProfileCredentialsProvider(false)
    )

  val pandaDomain: String = config.getString("panda.domain")
  val pandaAuthCallback: String = config.getString("panda.authCallback")
  val pandaSystem: String = config.getString("panda.system")
  val pandaS3Client: AmazonS3 = AmazonS3ClientBuilder.standard().withCredentials(pandaAwsCredentials).withRegion(region).build()

  val elkKinesisStream: String = config.getString("elk.kinesis.stream")
  val elkLoggingEnabled: Boolean = getPropertyWithDefault("elk.logging.enabled", config.getBoolean, default = true)

  val publishingMetricsKinesisStream: String = config.getString("kinesis.publishingMetricsStream")

  val tagManagerUrl: String = getPropertyWithDefault("tagManager.url", config.getString, default = "https://tagmanager.gutools.co.uk") + "/hyper/tags"

  //This is for uniquely identifying the kinesis application when running the app locally on multiple DEV machines
  val devIdentifier: String = if(stage == "DEV") config.getString("user.name") else ""

  val workflowUrl: String =  config.getString("workflow.url")

  val hmacSecret: String = config.getString("hmacSecret")

  private def getPropertyWithDefault[T](path: String, getVal: String => T, default: T): T = {
    if (config.hasPath(path)) getVal(path)
    else default
  }
}
