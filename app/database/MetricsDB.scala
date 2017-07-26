package database

import java.util.Date

import config.Config
import io.getquill.{PostgresJdbcContext, SnakeCase}
import models.db._
import org.joda.time.DateTime

class MetricsDB(dbContext: PostgresJdbcContext[SnakeCase]) {
  import dbContext._

  private implicit val encodePublicationDate = MappedEncoding[DateTime, Date](d => d.toDate)
  private implicit val decodePublicationDate = MappedEncoding[Date, DateTime](d => new DateTime(d.getTime))

  def getComposerMetrics: List[ComposerMetric] =
    dbContext.run(
      quote {
        querySchema[ComposerMetric]("composer_metrics")
      })

  def insertComposerMetric(metric: ComposerMetric): Long =
    dbContext.run(
      quote {
        querySchema[ComposerMetric]("composer_metrics").insert(lift(metric))
      })

  def getForks: List[Fork] =
    dbContext.run(
      quote {
        querySchema[Fork]("forks")
      })

  def insertFork(fork: Fork): Long =
    dbContext.run(
      quote {
        querySchema[Fork]("forks").insert(lift(fork))
      })

  def getInCopyMetrics: List[InCopyMetric] =
    dbContext.run(
      quote {
        querySchema[InCopyMetric]("incopy_metrics")
      })

  def insertInCopyMetric(metric: InCopyMetric): Long =
    dbContext.run(
      quote {
        querySchema[InCopyMetric]("incopy_metrics").insert(lift(metric))
      })

  def getPublishingMetrics(implicit filters: MetricsFilters): List[Metric] =
    dbContext.run(
      quote {
        new MetricsQuery(dbContext).applyFilters(querySchema[Metric]("metrics"))
      })

  def insertPublishingMetric(metric: Metric): Long =
    dbContext.run(
      quote {
        querySchema[Metric]("metrics").insert(lift(metric))
      })
}
