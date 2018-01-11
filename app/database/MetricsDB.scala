package database

import com.github.tototoshi.slick.PostgresJodaSupport._
import com.gu.editorialproductionmetricsmodels.models.MetricOpt
import models.ProductionMetricsError
import models.db.Schema._
import models.db._
import org.joda.time.DateTime
import play.api.Logger
import slick.jdbc.PostgresProfile.api._
import util.AsyncHelpers._
import util.PostgresOpsImport._
import config.Config._

class MetricsDB(implicit val db: Database) {

  private def upsertPublishingMetric(metric: Metric): Either[ProductionMetricsError, Metric] = {
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
      forksTable.map(f => (f.composerId, f.timeToPublication, f.time))
        .join(metricsTable).on(_._1 === _.composerId)
        .filter(MetricsFilters.forkFilters)
        .map { case ((_, timeToPublication, forkTime), _) => (timeToPublication, forkTime.toDayDateTrunc) }
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

  def getDistinctNewspaperBooks: Either[ProductionMetricsError, Seq[Option[String]]] =
    await(db.run(metricsTable.filter(!_.newspaperBook.isEmpty).map(_.newspaperBook).distinct.result))

  def getGroupedWordCounts(implicit filters: MetricsFilters): Either[ProductionMetricsError, List[GroupedWordCount]] = {
    awaitWithTransformation(db.run(metricsTable
      .filter(MetricsFilters.metricFilters)
      .filter(!_.wordCount.isEmpty)
      .map( metric =>
        Case
          If(metric.wordCount between(0, 349)) Then 0
          If(metric.wordCount between(350, 649)) Then 350
          If(metric.wordCount between(650, 899)) Then 650
          Else 900
      )
      .groupBy(identity)
      .map{case (lowerBound, metric) => (lowerBound, metric.size)}
      .result))(dbResult => {
        dbResult.zipWithIndex.foldRight(List[GroupedWordCount]())((resultWithIndex: ((Int, Int), Int), wordCounts: List[GroupedWordCount]) => {
          val (result: (Int, Int), index: Int) = resultWithIndex
          val (lowerBound: Int, count: Int) = result

          // This is the last element in the list of ranges, it does no t have an upper bound
          if (index == dbResult.length - 1) wordCounts ::: List(GroupedWordCount((lowerBound, None), count))
          // We can figure out the upper bound of the range by looking at the lower bound of the next element
          else {
            val upperBound = dbResult(index + 1)._1 + 1
            wordCounts ::: List(GroupedWordCount((lowerBound, Some(upperBound)), count))
          }
        })
      }
    )
  }

  def getArticlesWithWordCounts(withCommissionedLength: Boolean)(implicit filters: MetricsFilters):
    Either[ProductionMetricsError, List[WordCountResponse]] = {

    val filterFunction = if (withCommissionedLength)
      MetricsFilters.withCommissionedWordCountFilters
    else MetricsFilters.withoutCommissionedWordCountFilters

    awaitWithTransformation(db.run(metricsTable.filter(filterFunction)
      .take(maxNumberOfArticlesToReturn)
      .sortBy((metric) => {
        for {
          wordCount <- metric.wordCount
          commissionedWordCount <- metric.commissionedWordCount
        } yield (commissionedWordCount - wordCount)
      })
      .map { case (metric) => (metric.path, metric.wordCount, metric.commissionedWordCount) }
      .result)) { dbResult: Seq[(Option[String], Option[Int], Option[Int])] =>
      dbResult.map(result => WordCountResponse(result._1, result._2, result._3)).toList
    }
  }
}
