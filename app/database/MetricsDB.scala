package database

import models.db._
import slick.jdbc.PostgresProfile.api._
import models.db.Schema._
import util.AsyncHelpers._

import scala.concurrent.Future

class MetricsDB(val db: Database) {

//  private def applyFilters(q: Quoted[Query[Metric]])(implicit filters: MetricsFilters): Quoted[Query[Metric]] = quote {
//    filters.filtersList.foldLeft(q)((acc, filterName) => filterName match {
//      case "desk" =>
//        filters.desk.fold(acc)(desk => acc.filter(m => m.commissioningDesk.map(_.toUpperCase) == lift(filters.desk.map(_.toUpperCase))))
//      case "startingSystem" =>
//        filters.startingSystem.fold(acc)(startingSystem => acc.filter(m => m.startingSystem.toUpperCase == lift(startingSystem.toUpperCase)))
//      case "dateRange" =>
//        filters.dateRange.fold(acc)(dateRange =>
//          acc.filter(m => m.creationTime > lift(dateRange.from.getOrElse(DateTime.now().minusYears(10))) && m.creationTime < lift(dateRange.to.getOrElse(DateTime.now()))))
//      case _ => acc
//    })
//  }

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
