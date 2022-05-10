import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import config.Config._
import controllers.{AssetsComponents, PanDomainAuthActions}
import database.MetricsDB
import lib.kinesis.ProductionMetricsStreamReader
import play.api.ApplicationLoader.Context
import play.api.db.evolutions.EvolutionsComponents
import play.api.db.{DBComponents, HikariCPComponents}
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import database.DatabaseConfiguration.db
import play.api.libs.ws.WSClient
import play.api.BuiltInComponentsFromContext
import play.filters.HttpFiltersComponents
import com.gu.pandomainauth.PanDomainAuthSettingsRefresher
import play.api.mvc.ControllerComponents

import scala.concurrent.Future

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
    with AhcWSComponents
    with EvolutionsComponents
    with DBComponents
    with HikariCPComponents
    with AssetsComponents
    with HttpFiltersComponents {


  //Lazy val needs to be accessed so that database evolutions are applied
  applicationEvolutions
  //Context is created here so we can add a stop hook to kill the db connection when the app terminates

  lazy val metricsDb = new MetricsDB()

  lazy val kinesisStreamConsumer = new ProductionMetricsStreamReader(publishingMetricsKinesisStream, stage, metricsDb)
  kinesisStreamConsumer.start

  //Closes connection to db on app termination
  applicationLifecycle.addStopHook(() => Future.successful(db.close()))

  val awsCredentialsProvider: AWSCredentialsProvider =
    new AWSCredentialsProviderChain(
      new ProfileCredentialsProvider(configuration.getOptional[String]("panda.awsCredsProfile").getOrElse("panda")),
      new InstanceProfileCredentialsProvider(false)
    )

  private val panDomainSettings = new PanDomainAuthSettingsRefresher(
    domain = configuration.get[String]("panda.domain"),
    system = "video",
    actorSystem,
    awsCredentialsProvider
  )

  private val hmacAuthActions = new PanDomainAuthActions {

    override def wsClient: WSClient = AppComponents.this.wsClient

    override def panDomainSettings: PanDomainAuthSettingsRefresher = AppComponents.this.panDomainSettings

    override def controllerComponents: ControllerComponents = AppComponents.this.controllerComponents
  }

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets)
  lazy val appController = new controllers.Application(wsClient, metricsDb, controllerComponents, hmacAuthActions)
  lazy val loginController = new controllers.Login(wsClient, controllerComponents, hmacAuthActions)
  lazy val healthcheckController = new controllers.Healthcheck(controllerComponents)
}


