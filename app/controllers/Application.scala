package controllers

import com.gu.editorialproductionmetricsmodels.models.{ForkData, MetricOpt}
import com.gu.pandahmac.HMACAuthActions
import config.AppConfig
import database.MetricsDB
import io.circe.generic.auto._
import models.{APIResponse, WordCountAPIResponse}
import models.db.{CommissionedLength, Filters, FinalLength, Fork}
import play.api.Logging
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc.{BaseController, ControllerComponents}
import util.CORSable
import util.Parser._
import util.Utils._

// Implicit
import models.db.CountResponse._

class Application(
                   val wsClient: WSClient,
                   val db: MetricsDB,
                   val controllerComponents: ControllerComponents,
                   authActions: HMACAuthActions,
                   config: AppConfig
                 ) extends BaseController with Circe with Logging {

  import authActions.{APIAuthAction, APIHMACAuthAction, AuthAction}

  def allowCORSAccess(methods: String, args: Any*) = CORSable(config.workflowUrl) {
    Action { implicit req =>
      val requestedHeaders = req.headers("Access-Control-Request-Headers")
      NoContent.withHeaders("Access-Control-Allow-Methods" -> methods, "Access-Control-Allow-Headers" -> requestedHeaders)
    }
  }

  def index(path: String) = AuthAction {
    logger.info(s"I am the ${config.appName}")
    Ok(views.html.index())
  }

  def getCommissioningDeskList = APIAuthAction {
    APIResponse {
      for {
        tagManagerResponse <- getTrackingTags(wsClient, config.tagManagerUrl)
        commissioningDesks <- stringToCommissioningDesks(tagManagerResponse.body)
      } yield commissioningDesks.data.map(_.data.path)
    }
  }

  def getStartedIn(system: String) = APIAuthAction { req =>
    APIResponse {
      for {
        originatingSystem <- extractOriginatingSystem(system)
        filters = Filters(req.queryString).copy(originatingSystem = Some(originatingSystem))
        metric <- db.getGroupedByDayMetrics(filters)
      } yield metric
    }
  }

  def getWorkflowData(inWorkflow: Boolean) = APIAuthAction { req =>
    APIResponse {
      for {
        metric <- db.getGroupedByDayMetrics(Filters(req.queryString).copy(inWorkflow = Some(inWorkflow)))
      } yield metric
    }
  }

  def upsertMetric() = CORSable(config.workflowUrl) {
    APIHMACAuthAction(circe.json[MetricOpt]) { req =>
      APIResponse {
        for {
          metricFromDb <- db.getPublishingMetricsWithComposerId(req.body.composerId)
          metric <- db.updateOrInsert(metricFromDb, req.body)
        } yield metric
      }
    }
  }

  def insertFork() = APIHMACAuthAction(circe.json[ForkData]) { req =>
    APIResponse {
      val metricOpt = MetricOpt(req.body)
      for {
        metricFromDB <- db.getPublishingMetricsWithComposerId(Some(req.body.digitalDetails.composerId))
        _ <- db.updateOrInsert(metricFromDB, metricOpt)
        _ <- db.insertFork(Fork(req.body))
      } yield req.body
    }
  }

  def getForks(newspaperBook: String) = APIAuthAction { req =>
    APIResponse {
      db.getForks(Filters(req.queryString).copy(newspaperBook = Some(newspaperBook)))
    }
  }

  def getNewspaperBookList = APIAuthAction(APIResponse(db.getDistinctNewspaperBooks))

  def getArticlesWithWordCounts() = APIAuthAction { req =>
    APIResponse {
      for {
        articlesWithoutCommissionedLength <- db.getArticlesWithWordCounts(Filters(req.queryString).copy(hasCommissionedLength = Some(false)))
        articlesWithCommissionedLength <- db.getArticlesWithWordCounts(Filters(req.queryString).copy(hasCommissionedLength = Some(true)))
      } yield WordCountAPIResponse(articlesWithoutCommissionedLength, articlesWithCommissionedLength)
    }
  }

  def getArticlesGroupedByFinalLength() = APIAuthAction { req =>
    APIResponse {
      for {
        groupedByFinalLength <- db.getArticlesGroupedByLengthBounds(FinalLength)(Filters(req.queryString))
      } yield groupedByFinalLength
    }
  }

  def getArticlesGroupedByCommissionedLength() = APIAuthAction { req =>
    APIResponse {
      for {
        groupedByCommissionedLength <- db.getArticlesGroupedByLengthBounds(CommissionedLength)(Filters(req.queryString))
      } yield groupedByCommissionedLength
    }
  }
}
