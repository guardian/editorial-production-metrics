package config

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.regions.Region
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.gu.cm.{Mode, Configuration => ConfigurationMagic}
import services.AwsInstanceTags

object Config extends AwsInstanceTags {

  val stage: String = readTag("Stage") getOrElse "DEV"
  val appName: String = readTag("App") getOrElse "editorial-production-metrics"
  val stack: String = readTag("Stack") getOrElse "flexible"
  val region: Region = services.EC2Client.region

  val awsCredsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
  )

  private val configMagicMode: Mode = stage match {
    case "DEV" => Mode.Dev
    case "CODE" => Mode.Prod
    case "PROD" => Mode.Prod
    case _ => sys.error("invalid stage")
  }

  val config = ConfigurationMagic(appName, configMagicMode).load.resolve()

  val elkKinesisStream: String = config.getString("elk.kinesis.stream")
  val elkLoggingEnabled: Boolean = getPropertyWithDefault("elk.logging.enabled", config.getBoolean, default = true)

  val pandaDomain: String = config.getString("panda.domain")
  val pandaAuthCallback: String = config.getString("panda.authCallback")
  val pandaSystem: String = config.getString("panda.system")
  val pandaAwsCredsProfile: String = getPropertyWithDefault("panda.awsCredsProfile", config.getString, "panda")

  val pandaAwsCredentialsProvider: AWSCredentialsProvider =
    new AWSCredentialsProviderChain(
      new ProfileCredentialsProvider(pandaAwsCredsProfile),
      new InstanceProfileCredentialsProvider(false)
    )

  val pandaS3Client: AmazonS3 = AmazonS3ClientBuilder.standard().withCredentials(pandaAwsCredentialsProvider).withRegion(region.getName).build()

  val publishingMetricsKinesisStream: String = config.getString("kinesis.publishingMetricsStream")

  val tagManagerUrl: String = getPropertyWithDefault("tagManager.url", config.getString, default = "https://tagmanager.gutools.co.uk") + "/hyper/tags"

//  This is for uniquely identifying the kinesis application when running the app locally on multiple DEV machines
  val devIdentifier: String = if(stage == "DEV") config.getString("user") else ""

  val workflowUrl: String =  config.getString("workflow.url")

  val hmacSecret: String = config.getString("hmacSecret")

  val maxNumberOfArticlesToReturn: Int = 1000

  private def getPropertyWithDefault[T](path: String, getVal: String => T, default: T): T = {
    if (config.hasPath(path)) getVal(path)
    else default
  }
}
