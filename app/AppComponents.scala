import config.Config._
import database.MetricsDB
import lib.kinesis.ProductionMetricsStreamReader
import play.api.ApplicationLoader.Context
import play.api._
import play.api.db.evolutions.EvolutionsComponents
import play.api.db.{DBComponents, HikariCPComponents}
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import database.DatabaseConfiguration.db

import scala.concurrent.Future

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents with EvolutionsComponents with DBComponents with HikariCPComponents {


  //Lazy val needs to be accessed so that database evolutions are applied
  applicationEvolutions
  //Context is created here so we can add a stop hook to kill the db connection when the app terminates

  lazy val metricsDb = new MetricsDB()

  lazy val kinesisStreamConsumer = new ProductionMetricsStreamReader(publishingMetricsKinesisStream, stage, metricsDb)
  kinesisStreamConsumer.start

  //Closes connection to db on app termination
  applicationLifecycle.addStopHook(() => Future.successful(db.close()))

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets)
  lazy val assets = new controllers.Assets(httpErrorHandler)
  lazy val appController = new controllers.Application()(wsClient, metricsDb)
  lazy val loginController = new controllers.Login(wsClient)
  lazy val healthcheckController = new controllers.Healthcheck()
}


