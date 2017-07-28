package database

import models.db._
import slick.jdbc.PostgresProfile.api._
import models.db.Schema._
import util.AsyncHelpers._

import scala.concurrent.Future

class MetricsDB(val db: Database) {

  def getComposerMetrics: Future[Seq[ComposerMetric]] = db.run(composerMetricsTable.result)

  def insertComposerMetric(metric: ComposerMetric): Future[Int] = db.run(composerMetricsTable += metric)

  def getInCopyMetrics: Future[Seq[InCopyMetric]] = db.run(inCopyMetricsTable.result)

  def insertInCopyMetric(metric: InCopyMetric): Future[Int] = db.run(inCopyMetricsTable += metric)

  def getPublishingMetrics: Future[Seq[Metric]] = db.run(metricsTable.result)

  def insertPublishingMetric(metric: Metric): Future[Int] = db.run(metricsTable += metric)

  def getForks: Future[Seq[Fork]] = db.run(forksTable.result)

  def insertFork(fork: Fork) = db.run(forksTable += fork)

  def getStartedInSystem(implicit filters: MetricsFilters): Seq[Metric] =
    await(db.run(metricsTable.filter(MetricsFilters.metricFilters).result))
//    dbContext.run(
//      quote {
//        applyFilters(querySchema[Metric]("metrics")).groupBy(m => m.creationTime).map {
//          case (date, metric) => (date, metric.size)
//        }
//      })
}
