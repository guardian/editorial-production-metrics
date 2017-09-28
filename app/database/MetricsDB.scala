package database

import com.github.tototoshi.slick.PostgresJodaSupport._
import com.gu.editorialproductionmetricsmodels.models.MetricOpt
import models.db.Schema._
import models.db._
import models.{ProductionMetricsError, UnexpectedDbExceptionError}
import org.joda.time.DateTime
import play.api.Logger
import slick.jdbc.PostgresProfile.api._
import util.AsyncHelpers._
import util.PostgresOpsImport._

class MetricsDB(implicit val db: Database) {

  def upsertPublishingMetric(metric: Metric): Either[ProductionMetricsError, Metric] = {
    val result: Either[ProductionMetricsError, Int] = await(db.run(metricsTable.insertOrUpdate(metric)))
    if (result.isLeft) Left(result.left.get) else Right(metric)
  }
  def getPublishingMetricsWithComposerId(composerId: Option[String]): Either[ProductionMetricsError, Option[Metric]] =
    await(db.run(metricsTable.filter(_.composerId === composerId).result.headOption))

  def updateOrInsert(metric: Option[Metric], metricOpt: MetricOpt): Either[ProductionMetricsError, Metric] = metric match {
    case Some(m) =>
      Metric.updateMetric(m, metricOpt).fold(
        err => Left(err),
        updated => {
          Logger.info(s"Metric found, updating entry with: $updated")
          upsertPublishingMetric(updated)
        })
    case None =>
      Logger.info(s"Inserting new metric: $metricOpt")
      upsertPublishingMetric(Metric(metricOpt))
  }

  def getForks(implicit filters: MetricsFilters): Either[ProductionMetricsError, List[ForkResponse]] =
    awaitWithTransformation(db.run(
      forksTable.map(f => (f.composerId, f.timeToPublication))
        .join(metricsTable).on(_._1 === _.composerId)
        .filter(MetricsFilters.forksFilters)
        .map { case ((composerId, timeToPublication), metric) => (timeToPublication, metric.issueDate.toDayDateTrunc) }
        .result)
      )(_.flatMap(ForkResponse.convertToForkResponse).toList)

  def insertFork(fork: Fork): Either[ProductionMetricsError, Int] = await(db.run(forksTable += fork))

  // This needs to return the data grouped by day. For this we've defined dateTrunc to tell Slick
  // to "import" the date_trunc function from postgresql
  def getGroupedByDayMetrics(implicit filters: MetricsFilters): Either[ProductionMetricsError, List[CountResponse]] =
    awaitWithTransformation(db.run(metricsTable.filter(MetricsFilters.metricFilters).map(m => (m.id, m.creationTime.toDayDateTrunc))
      .groupBy(_._2).map {
        case (date, metric) => (date, metric.size)
      }.result)){ dbResult: Seq[(DateTime, Int)] =>
        dbResult.map(pair => CountResponse(new DateTime(pair._1), pair._2)).toList
      }
}
