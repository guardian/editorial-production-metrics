import config.{Config, LogConfig}
import database.MetricsDB
import lib.kinesis.ProductionMetricsStreamReader
import play.api.ApplicationLoader.Context
import play.api._
import play.api.db.evolutions.EvolutionsComponents
import play.api.db.{DBComponents, HikariCPComponents}
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.Future

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents with EvolutionsComponents with DBComponents with HikariCPComponents {

  val config = new Config(configuration)
  val logger = new LogConfig(config)

  //Lazy val needs to be accessed so that database evolutions are applied
  applicationEvolutions
  //Context is created here so we can add a stop hook to kill the db connection when the app terminates
  private lazy val dbConfig: DatabaseConfig[PostgresProfile] = DatabaseConfig.forConfig("slick.dbs.default", configuration.underlying)
  private lazy val db: Database = dbConfig.db
  lazy val metricsDb = new MetricsDB(db)

  lazy val kinesisStreamConsumer = new ProductionMetricsStreamReader(config.publishingMetricsKinesisStream, config.stage, config)
  kinesisStreamConsumer.start()

  //Closes connection to db on app termination
  applicationLifecycle.addStopHook(() => Future.successful(db.close()))

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets)
  lazy val assets = new controllers.Assets(httpErrorHandler)
  lazy val appController = new controllers.App(wsClient, config, metricsDb)
  lazy val loginController = new controllers.Login(wsClient, config)
  lazy val healthcheckController = new controllers.Healthcheck()
}


