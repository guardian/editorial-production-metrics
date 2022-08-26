import controllers.{AssetsComponents, PanDomainAuthActions}
import database.{DatabaseConfiguration, MetricsDB}
import lib.kinesis.ProductionMetricsStreamReader
import play.api.ApplicationLoader.Context
import play.api.db.evolutions.EvolutionsComponents
import play.api.db.{DBComponents, HikariCPComponents}
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import play.api.libs.ws.WSClient
import play.api.BuiltInComponentsFromContext
import play.filters.HttpFiltersComponents
import com.gu.pandomainauth.PanDomainAuthSettingsRefresher
import config.AppConfig
import play.api.mvc.{ControllerComponents, EssentialFilter}

import scala.concurrent.Future

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
    with AhcWSComponents
    with EvolutionsComponents
    with DBComponents
    with HikariCPComponents
    with AssetsComponents
    with HttpFiltersComponents
    with DatabaseConfiguration {

  val config = new AppConfig(configuration)


  //Lazy val needs to be accessed so that database evolutions are applied
  applicationEvolutions
  //Context is created here so we can add a stop hook to kill the db connection when the app terminates

  lazy val metricsDb = new MetricsDB()

  lazy val kinesisStreamConsumer = new ProductionMetricsStreamReader(config, metricsDb)
  kinesisStreamConsumer.start

  //Closes connection to db on app termination
  applicationLifecycle.addStopHook(() => Future.successful(db.close()))

  override lazy val httpFilters: Seq[EssentialFilter] = super.httpFilters.filterNot(_ == allowedHostsFilter)

  private val panDomainSettings = new PanDomainAuthSettingsRefresher(
    domain = config.pandaDomain,
    system = "video",
    bucketName = "pan-domain-auth-settings",
    settingsFileKey = s"${config.pandaDomain}.settings",
    s3Client = config.pandaS3Client,
  )

  private val hmacAuthActions = new PanDomainAuthActions {
    override val pandaAuthCallback: String = config.pandaAuthCallback
    override val hmacSecret: String = config.hmacSecret

    override def wsClient: WSClient = AppComponents.this.wsClient

    override def panDomainSettings: PanDomainAuthSettingsRefresher = AppComponents.this.panDomainSettings

    override def controllerComponents: ControllerComponents = AppComponents.this.controllerComponents
  }

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets)
  lazy val appController = new controllers.Application(wsClient, metricsDb, controllerComponents, hmacAuthActions, config)
  lazy val loginController = new controllers.Login(wsClient, controllerComponents, hmacAuthActions)
  lazy val healthcheckController = new controllers.Healthcheck(controllerComponents)
}


