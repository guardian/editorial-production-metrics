import config.LogConfig
import play.api._
import play.api.ApplicationLoader.Context
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import config._
import database.MetricsDB
import db.{DBComponents, HikariCPComponents}
import lib.kinesis.ProductionMetricsStreamReader
import play.api.db.evolutions.EvolutionsComponents

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents with EvolutionsComponents with DBComponents with HikariCPComponents {

  val config = new Config(configuration)
  val logger = new LogConfig(config)

  //Lazy val needs to be accessed so that database evolutions are applied
  applicationEvolutions
  lazy val db = new MetricsDB(config)
  lazy val kinesisStreamConsumer = new ProductionMetricsStreamReader("editorial-production-metrics-DEV", config.stage, config)
  kinesisStreamConsumer.start


  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets)
  lazy val assets = new controllers.Assets(httpErrorHandler)
  lazy val appController = new controllers.App(wsClient, config, db)
  lazy val loginController = new controllers.Login(wsClient, config)
  lazy val healthcheckController = new controllers.Healthcheck()
}


