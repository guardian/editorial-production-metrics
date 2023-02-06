import software.amazon.awssdk.auth.credentials.{AwsCredentialsProvider, DefaultCredentialsProvider, ProfileCredentialsProvider}
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}

import java.util.TimeZone
import play.api.{Application, ApplicationLoader, LoggerConfigurator, Configuration}
import play.api.ApplicationLoader.Context
import com.gu.conf.{ConfigurationLoader, FileConfigurationLocation, SSMConfigurationLocation}

import java.io.File

class AppLoader extends ApplicationLoader {

  override def load(context: Context): Application = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }

    /* It's horrible, but this is absolutely necessary for correct interpretation
     * of datetime columns in the database which do not have a timezone.
     * The JDBC driver interprets these using the JVM's default timezone which is
     * almost certainly what no sane person ever wants to do.
     */
    System.setProperty("user.timezone", "UTC")
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))

    val defaultAppName = "editorial-production-metrics"
    val identity = AppIdentity.whoAmI(defaultAppName)

    val awsCredentials: AwsCredentialsProvider = identity match {
      case _: DevIdentity => ProfileCredentialsProvider.create("composer")
      case _ => DefaultCredentialsProvider.create()
    }

    val loadedConfig = ConfigurationLoader.load(identity, awsCredentials) {
      case identity: AwsIdentity => SSMConfigurationLocation.default(identity)
      case _: DevIdentity =>
        val home = System.getProperty("user.home")
        FileConfigurationLocation(new File(s"$home/.gu/$defaultAppName.conf"))
    }

    new AppComponents(context.copy(
      initialConfiguration = Configuration(loadedConfig).withFallback(context.initialConfiguration)),
      identity
    ).application
  }

}
