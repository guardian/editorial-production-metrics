package database

import java.util.Date

import io.getquill.{PostgresJdbcContext, SnakeCase}
import models.db._
import org.joda.time.DateTime

class MetricsDB(val dbContext: PostgresJdbcContext[SnakeCase]) {
  import dbContext._

  private implicit val encodePublicationDate = MappedEncoding[DateTime, Date](d => d.toDate)
  private implicit val decodePublicationDate = MappedEncoding[Date, DateTime](d => new DateTime(d.getTime))

  implicit class DateTimeQuotes(left: DateTime) {
    def >(right: DateTime) = quote(infix"$left > $right".as[Boolean])
    def <(right: DateTime) = quote(infix"$left < $right".as[Boolean])
  }

  private def applyFilters(q: Quoted[Query[Metric]])(implicit filters: MetricsFilters): Quoted[Query[Metric]] = quote {
    filters.filtersList.foldLeft(q)((acc, filterName) => filterName match {
      case "desk" =>
        filters.desk.fold(acc)(desk => acc.filter(m => m.commissioningDesk.map(_.toUpperCase) == lift(filters.desk.map(_.toUpperCase))))
      case "startingSystem" =>
        filters.startingSystem.fold(acc)(startingSystem => acc.filter(m => m.startingSystem.toUpperCase == lift(startingSystem.toUpperCase)))
      case "dateRange" =>
        filters.dateRange.fold(acc)(dateRange =>
          acc.filter(m => m.creationTime > lift(dateRange.from.getOrElse(DateTime.now().minusYears(10))) && m.creationTime < lift(dateRange.to.getOrElse(DateTime.now()))))
      case _ => acc
    })
  }

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
        querySchema[Metric]("metrics")
      })

  def insertPublishingMetric(metric: Metric): Long =
    dbContext.run(
      quote {
        querySchema[Metric]("metrics").insert(lift(metric))
      })

  def getStartedInSystem(implicit filters: MetricsFilters): List[(DateTime, Long)] =
    dbContext.run(
      quote {
        applyFilters(querySchema[Metric]("metrics")).groupBy(m => m.creationTime).map {
          case (date, metric) => (date, metric.size)
        }
      })
}
