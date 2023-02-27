package helpers

import java.util.UUID

import com.gu.editorialproductionmetricsmodels.models.{OriginatingSystem, ProductionOffice}
import models.db.Schema._
import models.db.{Fork, Metric}
import org.joda.time.DateTime
import slick.jdbc.PostgresProfile.api._
import util.AsyncHelpers.await

object TestData {
  private[this] val sampleSize = 50
  private[this] val random = new scala.util.Random(scala.util.Random.nextLong())
  private[this] val composerIds = composerIdsGenerator(Nil, sampleSize)
  private[this] val originatingSystems: List[OriginatingSystem] = OriginatingSystem.values.toList
  private[this] val commissioningDesks: List[String] = List("tracking/commissioningdesk/uk-science", "tracking/commissioningdesk/cities", "tracking/commissioningdesk/uk-culture")
  private[this] val userDesks: List[String] = List("userDesk_1", "userDesk_2", "userDesk_3")
  private[this] val productionOffices: List[ProductionOffice] = ProductionOffice.values.toList
  private[this] val octopusStatuses: List[String] = List("octopusStatus_1", "octopusStatus_2", "octopusStatus_3")
  private[this] val forkApplications: List[String] = List("forkApplication_1", "forkApplication_2", "forkApplication_3")
  private[this] val workflowStatuses: List[String] = List("Stub", "Writers", "Desk", "Production Editor", "Subs", "Revise", "Final", "Hold")
  private[this] val bookSectionNames: List[String] = List("News", "Financial", "Sport")
  private[this] val bookSectionCodes: List[String] = List("gdn.nws", "gdn.fnc", "gdn.spt")
  private[this] val newspaperBooks: List[String] = List("theguardian/mainsection", "theguardian/g2")
  private[this] val newspaperBookSections: List[String] = List("theguardian/mainsection/news", "theguardian/mainsection/financial")
  private[this] val metrics: List[Metric] = randomMetrics(Nil, sampleSize)
  private[this] val forks: List[Fork] = randomForks(Nil, sampleSize)

  def setup(implicit db: Database): Unit = {
    metrics.foreach(addMetric)
    forks.foreach(addFork)
  }

  def addFork(fork: Fork)(implicit db: Database) = await(db.run(forksTable += fork))
  def addMetric(metric: Metric)(implicit db: Database) = await(db.run(metricsTable += metric))

  private[this] def chooseItem[A](list: List[A]): A = list(random.nextInt(list.size - 1))

  private[this] def chooseBool: Boolean = random.nextInt(2) % 2 == 0

  private[this] def chooseDate: DateTime = DateTime.now().minusHours(random.nextInt(24 * 50))

  private[this] def chooseInt: Int = Math.abs(random.nextInt())

  private[this] def opt[A](a: A): Option[A] = if (chooseBool) Some(a) else None

  private[this] def composerIdsGenerator(acc: List[String], size: Int): List[String] =
    if (size == 0) acc else composerIdsGenerator(s"composerId_$size" :: acc, size - 1)

  private[this] def generateRandomMetric(pos: Int): Metric = Metric(
    id = UUID.randomUUID().toString, //unique
    originatingSystem = chooseItem(originatingSystems),
    composerId = Some(s"composerId_$pos"), //unique
    storyBundleId = opt(s"storyBundleId_$pos"), //unique
    commissioningDesk = Some(chooseItem(commissioningDesks)),
    userDesk = Some(chooseItem(userDesks)),
    inWorkflow = chooseBool,
    inNewspaper = chooseBool,
    creationTime = chooseDate,
    firstPublicationTime = opt(chooseDate),
    roundTrip = chooseBool,
    productionOffice = opt(chooseItem(productionOffices)),
    issueDate = opt(chooseDate),
    bookSectionName = opt(chooseItem(bookSectionNames)),
    bookSectionCode = opt(chooseItem(bookSectionCodes)),
    newspaperBook = opt(chooseItem(newspaperBooks)),
    newspaperBookSection = opt(chooseItem(newspaperBookSections))
  )

  def randomMetricWith(composerId: String, storyBundleId: String): Metric =
    generateRandomMetric(0).copy(composerId = Some(composerId), storyBundleId = Some(storyBundleId))

  def randomForkWith(composerId: String, time: DateTime) = generateRandomFork.copy(composerId = composerId, time = time)

  private[this] def randomMetrics(acc: List[Metric], size: Int): List[Metric] =
    if (size == 0) acc else randomMetrics(generateRandomMetric(size) :: acc, size - 1)

  private[this] def generateRandomFork: Fork = Fork(
    id = UUID.randomUUID.toString, //unique
    composerId = chooseItem(composerIds),
    time = chooseDate,
    wordCount = chooseInt,
    revisionNumber = chooseInt,
    timeToPublication = opt(chooseInt),
    octopusStatus = opt(chooseItem(octopusStatuses)),
    forkApplication = opt(chooseItem(forkApplications)),
    workflowStatus = opt(chooseItem(workflowStatuses))
  )

  private[this] def randomForks(acc: List[Fork], size: Int): List[Fork] =
    if (size == 0) acc else randomForks(generateRandomFork :: acc, size - 1)
}
