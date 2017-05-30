package database

import java.util.Date

import config.Config
import io.getquill.{PostgresJdbcContext, SnakeCase}
import models.db._
import org.joda.time.DateTime

class MetricsDB(configuration: Config) {

  lazy val dbContext = new PostgresJdbcContext[SnakeCase](configuration.dbConfig)
  import dbContext._

  private implicit val encodePublicationDate = MappedEncoding[DateTime, Date](d => d.toDate)
  private implicit val decodePublicationDate = MappedEncoding[Date, DateTime](d => new DateTime(d.getTime))

  def getComposerMetrics =
    dbContext.run(
      quote{
        querySchema[ComposerMetric]("composer_metrics")
      })

  def getForks =
    dbContext.run(
      quote {
        querySchema[Fork]("forks")
      }
    )

  def getInCopyMetrics =
    dbContext.run(
      quote{
        querySchema[InCopyMetric]("incopy_metrics")
      }
    )

  def getPublishingMetrics =
    dbContext.run(
      quote{
        querySchema[Metric]("metrics")
      }
    )
}
