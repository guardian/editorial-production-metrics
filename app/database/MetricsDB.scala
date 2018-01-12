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

  def getForks(implicit filters: Filters): Either[ProductionMetricsError, List[ForkResponse]] =
    awaitWithTransformation(db.run(
      forksTable.map(f => (f.composerId, f.timeToPublication, f.time))
        .join(metricsTable).on(_._1 === _.composerId)
        .filter(Filters.forkFilters)
        .map { case ((_, timeToPublication, forkTime), _) => (timeToPublication, forkTime.toDayDateTrunc) }
        .result)
    )(_.flatMap(ForkResponse.convertToForkResponse).toList)

  def insertFork(fork: Fork): Either[ProductionMetricsError, Int] = await(db.run(forksTable += fork))

  // This needs to return the data grouped by day. For this we've defined dateTrunc to tell Slick
  // to "import" the date_trunc function from postgresql
  def getGroupedByDayMetrics(implicit filters: Filters): Either[ProductionMetricsError, List[CountResponse]] =
    awaitWithTransformation(db.run(metricsTable.filter(Filters.originFilters).map(m => (m.id, m.creationTime.toDayDateTrunc))
      .groupBy(_._2).map {
        case (date, metric) => (date, metric.size)
      }.result)){ dbResult: Seq[(DateTime, Int)] =>
        dbResult.map(pair => CountResponse(new DateTime(pair._1), pair._2)).toList
      }

  def getDistinctNewspaperBooks: Either[ProductionMetricsError, Seq[Option[String]]] =
    await(db.run(metricsTable.filter(book => !book.newspaperBook.isEmpty && book.newspaperBook =!= "").map(_.newspaperBook).distinct.result))

  def getArticlesGroupedByLengthBounds(articleLength: ArticleLength)(implicit filters: Filters): Either[ProductionMetricsError, List[ArticleLengthGroup]] = {

    val lowerBoundsToUpperBounds: Map[Int, Int] = Map(
      0 -> 349,
      350 -> 649,
      650 -> 899
    )

    def assignLowerBound(length: Rep[Option[Int]]): Case.TypedCase[Int, Int] =
      (Case
        If(length between(0, lowerBoundsToUpperBounds.get(0).get)) Then 0
        If(length between(350, lowerBoundsToUpperBounds.get(350).get)) Then 350
        If(length between(650, lowerBoundsToUpperBounds.get(650).get)) Then 650
        If(length >= 900) Then 900)

    awaitWithTransformation(db.run(metricsTable
      .filter(Filters.originFilters)
      .map( metric => articleLength match {
        case FinalLength => assignLowerBound(metric.wordCount)
        case CommissionedLength => assignLowerBound(metric.commissionedWordCount)
      })
      .groupBy(identity)
      .map{case (lowerBound, metric) => (lowerBound, metric.size)}
      .result))(dbResult => {

      dbResult.foldRight(List[ArticleLengthGroup]())((result: (Option[Int], Int), wordCounts: List[ArticleLengthGroup]) => {
        result match {
          case (None, _) => wordCounts
          case (Some(lowerBound), count) => {
            wordCounts ::: List(ArticleLengthGroup((lowerBound, lowerBoundsToUpperBounds.get(lowerBound)), count))
          }
        }
      }).sortWith(_.range._1 < _.range._1)
    })
  }

  def getArticlesWithWordCounts(implicit filters: Filters):
    Either[ProductionMetricsError, ArticleWordCountResponseList] = {

    awaitWithTransformation(db.run(metricsTable.filter(Filters.wordCountFilters)
      .sortBy((metric) => {
        for {
          wordCount <- metric.wordCount
          commissionedWordCount <- metric.commissionedWordCount
        } yield (commissionedWordCount - wordCount)
      })
      .map { case (metric) => (metric.headline, metric.path, metric.wordCount, metric.commissionedWordCount)}
      .result)) {
        dbResult: Seq[(Option[String], Option[String], Option[Int], Option[Int])] => {
          val numberOfResults = dbResult.length

          val finalResults = dbResult.map(result => ArticleWordCountResponse(result._1, result._2, result._3, result._4))
            .toList
            .take(maxNumberOfArticlesToReturn)
          ArticleWordCountResponseList(finalResults, math.max(numberOfResults - maxNumberOfArticlesToReturn, 0))
        }
    }
  }
}
