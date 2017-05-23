import play.api.{Application, ApplicationLoader, LoggerConfigurator}
import play.api.ApplicationLoader.Context
import com.gu.cm.ConfigurationLoader

class AppLoader extends ApplicationLoader {

  override def load(context: Context): Application = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }

    val contextWithConfiguration = ConfigurationLoader.playContext("editorial-production-metrics", context)
    new AppComponents(contextWithConfiguration).application
  }

}
