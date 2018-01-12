package controllers

import cats.syntax.either._
import com.gu.editorialproductionmetricsmodels.models.{ForkData, MetricOpt}
import config.Config._
import database.MetricsDB
import io.circe.generic.auto._
import models.{WordCountAPIResponse, APIResponse}
import models.db.{Fork, Filters}
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import util.CORSable
import util.Parser._
import util.Utils._

// Implicit
import models.db.CountResponse._

class Application(implicit val wsClient: WSClient, val db: MetricsDB) extends Controller with PanDomainAuthActions {

  def allowCORSAccess(methods: String, args: Any*) = CORSable(workflowUrl) {
    Action { implicit req =>
      val requestedHeaders = req.headers("Access-Control-Request-Headers")
      NoContent.withHeaders("Access-Control-Allow-Methods" -> methods, "Access-Control-Allow-Headers" -> requestedHeaders)
    }
  }

  def index = AuthAction {
    Logger.info(s"I am the $appName")
    Ok(views.html.index())
  }

  def getCommissioningDeskList = APIAuthAction {
    APIResponse {
      for {
        tagManagerResponse <- getTrackingTags(wsClient, tagManagerUrl)
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

  def upsertMetric() = CORSable(workflowUrl) {
    APIHMACAuthAction { req =>
      APIResponse {
        for {
          bodyString <- extractRequestBody(req.body.asJson.map(_.toString))
          metricOpt <- extractFromString[MetricOpt](bodyString)
          metricFromDb <- db.getPublishingMetricsWithComposerId(metricOpt.composerId)
          metric <- db.updateOrInsert(metricFromDb, metricOpt)
        } yield metric
      }
    }
  }

  def insertFork() = APIHMACAuthAction { req =>
    APIResponse {
      for {
        bodyString <- extractRequestBody(req.body.asJson.map(_.toString))
        forkData <- extractFromString[ForkData](bodyString)
        metricOpt = MetricOpt(forkData)
        metricFromDB <- db.getPublishingMetricsWithComposerId(Some(forkData.digitalDetails.composerId))
        metric <- db.updateOrInsert(metricFromDB, metricOpt)
        fork <- db.insertFork(Fork(forkData))
      } yield forkData
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

  def getGroupedWordCounts() = APIAuthAction { req =>
    APIResponse {
      for {
        groupedWordCounts <- db.getGroupedWordCounts(Filters(req.queryString))
      } yield groupedWordCounts
    }
  }
}
