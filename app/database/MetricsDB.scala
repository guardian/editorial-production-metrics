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

  def getComposerMetrics =
    dbContext.run(
      quote{
        querySchema[ComposerMetric]("composer_metrics")
      })

  def insertComposerMetric(metric: ComposerMetric) =
    dbContext.run(
      quote {
        querySchema[ComposerMetric]("composer_metrics").insert(lift(metric))
      }
    )

  def getForks =
    dbContext.run(
      quote {
        querySchema[Fork]("forks")
      }
    )

  def insertFork(fork: Fork) =
    dbContext.run(
      quote {
        querySchema[Fork]("forks").insert(lift(fork))
      }
    )

  def getInCopyMetrics =
    dbContext.run(
      quote{
        querySchema[InCopyMetric]("incopy_metrics")
      }
    )

  def insertInCopyMetric(metric: InCopyMetric) =
    dbContext.run(
      quote {
        querySchema[InCopyMetric]("incopy_metrics").insert(lift(metric))
      }
    )

  def getPublishingMetrics =
    dbContext.run(
      quote{
        querySchema[Metric]("metrics")
      }
    )

  def insertPublishingMetric(metric: Metric) =
    dbContext.run(
      quote {
        querySchema[Metric]("metrics").insert(lift(metric))
      }
    )
}
