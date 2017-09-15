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

import scala.concurrent.ExecutionContext.Implicits.global

class MetricsDB(val db: Database) {

  private val dateTrunc: (Rep[String], Rep[DateTime]) => Rep[DateTime] =
    SimpleFunction.binary[String, DateTime, DateTime]("date_trunc")

  def getComposerMetrics: Seq[ComposerMetric] = await(db.run(composerMetricsTable.result))
  def insertComposerMetric(metric: ComposerMetric): Int = await(db.run(composerMetricsTable += metric))

  def getInCopyMetrics: Seq[InCopyMetric] = await(db.run(inCopyMetricsTable.result))
  def insertInCopyMetric(metric: InCopyMetric): Int = await(db.run(inCopyMetricsTable += metric))

  def getPublishingMetrics: Seq[Metric] = await(db.run(metricsTable.result))
  def insertPublishingMetric(metric: Metric): Int = await(db.run(metricsTable += metric))
  def upsertPublishingMetric(metric: Metric): Either[ProductionMetricsError, Metric] = {
    val result: Int = await(db.run(metricsTable.insertOrUpdate(metric)))
    if (result == 0) Left(UnexpectedDbExceptionError) else Right(metric)
  }
  def getPublishingMetricsWithComposerId(composerId: Option[String]): Option[Metric] =
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

  def getForks: Seq[Fork] = await(db.run(forksTable.result))
  def insertFork(fork: Fork): Either[ProductionMetricsError, Int] = await {
    db.run(forksTable += fork).map { result: Int => Right(result) }.recover { case _ => Left(UnexpectedDbExceptionError)}
  }

  // This needs to return the data grouped by day. For this we've defined dateTrunc to tell Slick
  // to "import" the date_trunc function from postgresql
  def getGroupedByDayMetrics(implicit filters: MetricsFilters): Either[ProductionMetricsError, List[CountResponse]] = await {
    db.run(metricsTable.filter(MetricsFilters.metricFilters).map(m => (m.id, dateTrunc("day", m.creationTime))).groupBy(_._2).map {
      case (date, metric) => (date, metric.size)
    }.result).map { result: Seq[(DateTime, Int)] =>
      Right(result.map(pair => CountResponse(new DateTime(pair._1), pair._2)).toList)
    }.recover { case _ => Left(UnexpectedDbExceptionError) }
  }
}
