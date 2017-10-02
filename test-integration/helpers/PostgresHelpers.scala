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
  private[this] val testDbName = "default"
  private[this] val setupJdbcUrl = s"jdbc:postgresql://localhost:5903/$testDbName"
  private[this] val testDbUser = "postgres"
  private[this] val testDbPassword = "postgres"
  //This is needed for applying evolutions.
  private[this] val database = Databases(
    driver = "org.postgresql.Driver",
    url = s"jdbc:postgresql://localhost:5903/$testDbName",
    name = testDbName,
    config = Map(
      "user" -> "postgres",
      "password" -> "postgres"
    )
  )
  implicit lazy val db: Database = Database.forURL(setupJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)

  override def beforeAll() {
    await(db.run(DBIO.seq(
      sqlu"DROP DATABASE IF EXISTS #$testDbName",
      sqlu"CREATE DATABASE #$testDbName")))
    Evolutions.applyEvolutions(database)
    TestData.setup
  }

  override def afterAll() {
    await(db.run(sqlu"DROP DATABASE #$testDbName"))
  }
}
