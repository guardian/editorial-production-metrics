package helpers

import java.util.TimeZone

import org.scalatest.{BeforeAndAfterAll, BeforeAndAfterEach, Suite}
import play.api.db.Databases
import play.api.db.evolutions.Evolutions
import slick.jdbc.PostgresProfile.api._
import util.AsyncHelpers.await

trait PostgresHelpers extends Suite with BeforeAndAfterAll with BeforeAndAfterEach {
  System.setProperty("user.timezone", "UTC")
  TimeZone.setDefault(TimeZone.getTimeZone("UTC"))

  private[this] val driver = "slick.jdbc.PostgresProfile"
  private[this] val testDbName = "metrics"
  private[this] val setupJdbcUrl = s"jdbc:postgresql://localhost:5902/$testDbName"
  private[this] val testDbUser = "metrics"
  private[this] val testDbPassword = "metrics"
  //This is needed for applying evolutions.
  private[this] val database = Databases(
    driver = "org.postgresql.Driver",
    url = s"jdbc:postgresql://localhost:5902/$testDbName",
    name = "default",
    config = Map(
      "user" -> testDbUser,
      "password" -> testDbPassword
    )
  )
  implicit lazy val db: Database = Database.forURL(setupJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)

  override def beforeAll(): Unit = {
    Evolutions.applyEvolutions(database)

    await(db.run(DBIO.seq(
      sqlu"DELETE FROM forks",
      sqlu"DELETE FROM metrics",
      sqlu"CREATE DATABASE #$testDbName")))
    Evolutions.applyEvolutions(database)
    TestData.setup
  }

  override def afterAll(): Unit = {
    await(db.run(DBIO.seq(
      sqlu"DELETE FROM forks",
      sqlu"DELETE FROM metrics"
    )))
  }
}
