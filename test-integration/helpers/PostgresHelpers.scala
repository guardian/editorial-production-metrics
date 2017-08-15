package helpers

import com.typesafe.config.ConfigFactory
import org.scalatest.{BeforeAndAfterAll, BeforeAndAfterEach, Suite}
import slick.jdbc.PostgresProfile.api._
import util.AsyncHelpers.await

import scala.util.Random

trait PostgresHelpers extends Suite with BeforeAndAfterAll with BeforeAndAfterEach {
  private[this] val config = ConfigFactory.load()

  private[this] val driver = "slick.driver.PostgresDriver"

  private[this] val setupJdbcUrl = config.getString("slick.dbs.default.db.url")
  private[this] val testDbName = Random.alphanumeric.take(10).mkString.replaceAll("[0-9]", "").toLowerCase
  private[this] val testJdbcUrl = setupJdbcUrl.take(setupJdbcUrl.lastIndexOf("/") + 1) + testDbName // replace setupDbName with random one

  private[this] val testDbUser = config.getString("slick.dbs.default.db.user")
  private[this] val testDbPassword = config.getString("slick.dbs.default.db.password")

  // This db is used for initial connection only (for setup purposes)
  private[this] val dbSetup = Database.forURL(setupJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)

  implicit val db = Database.forURL(testJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)

  override def beforeAll() {
    await(dbSetup.run(DBIO.seq(
      sqlu"DROP DATABASE IF EXISTS #$testDbName",
      sqlu"CREATE DATABASE #$testDbName")))
  }

  override def beforeEach() {
//    applicationEvolutions
//    await(db.run(Tables.schema.create))
//    DbConstants.setup(db)
  }
  override def afterEach() {
//    await(db.run(Tables.schema.drop))
  }

  override def afterAll() {
    await(dbSetup.run(sqlu"DROP DATABASE #$testDbName"))
  }
}
