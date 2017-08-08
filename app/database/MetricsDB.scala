package database

import java.sql.Timestamp

import models.db._
import slick.jdbc.PostgresProfile.api._
import models.db.Schema._
import org.joda.time.DateTime
import util.AsyncHelpers._

class MetricsDB(val db: Database) {

  def getComposerMetrics: Seq[ComposerMetric] = await(db.run(composerMetricsTable.result))
  def insertComposerMetric(metric: ComposerMetric): Int = await(db.run(composerMetricsTable += metric))

  def getInCopyMetrics: Seq[InCopyMetric] = await(db.run(inCopyMetricsTable.result))
  def insertInCopyMetric(metric: InCopyMetric): Int = await(db.run(inCopyMetricsTable += metric))

  def getPublishingMetrics: Seq[Metric] = await(db.run(metricsTable.result))
  def insertPublishingMetric(metric: Metric): Int = await(db.run(metricsTable += metric))

  def getForks: Seq[Fork] = await(db.run(forksTable.result))
  def insertFork(fork: Fork): Int = await(db.run(forksTable += fork))

  val dateTrunc: (Rep[String], Rep[Timestamp]) => Rep[Timestamp] =
    SimpleFunction.binary[String, Timestamp, Timestamp]("date_trunc")

  // This needs to return the data grouped by day. For this we've defined dateTrunc to tell Slick
  // to "import" the date_trunc function from postgresql
  def getStartedInSystem(implicit filters: MetricsFilters): Seq[(DateTime, Int)] =
    await(db.run(metricsTable.filter(MetricsFilters.metricFilters).map(m => (m.id, dateTrunc("day", m.creationTime))).groupBy(_._2).map{
      case (date, metric) => (date, metric.size)
    }.result)).map(pair => (new DateTime(pair._1), pair._2))
}
