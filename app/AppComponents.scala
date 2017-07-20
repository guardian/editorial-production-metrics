import config.{Config, LogConfig}
import play.api._
import play.api.ApplicationLoader.Context
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import database.MetricsDB
import db.{DBComponents, HikariCPComponents}
import io.getquill.{PostgresJdbcContext, SnakeCase}
import lib.kinesis.ProductionMetricsStreamReader
import play.api.db.evolutions.EvolutionsComponents

import scala.concurrent.Future

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents with EvolutionsComponents with DBComponents with HikariCPComponents {

  val config = new Config(configuration)
  val logger = new LogConfig(config)

  //Lazy val needs to be accessed so that database evolutions are applied
  applicationEvolutions
  //Context is created here so we can add a stop hook to kill the db connection when the app terminates
  lazy val dbContext = new PostgresJdbcContext[SnakeCase](config.dbConfig)
  lazy val db = new MetricsDB(dbContext)

  lazy val kinesisStreamConsumer = new ProductionMetricsStreamReader(config.publishingMetricsKinesisStream, config.stage, config)
  kinesisStreamConsumer.start

  //Closes connection to db on app termination
  applicationLifecycle.addStopHook(() => Future.successful(dbContext.close()))

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets)
  lazy val assets = new controllers.Assets(httpErrorHandler)
  lazy val appController = new controllers.App(wsClient, config, db)
  lazy val loginController = new controllers.Login(wsClient, config)
  lazy val healthcheckController = new controllers.Healthcheck()
}


