package helpers

import org.scalatest.{BeforeAndAfterAll, BeforeAndAfterEach, Suite}
import org.scalatestplus.play.guice.GuiceFakeApplicationFactory
import play.api.db.Databases
import play.api.db.evolutions.Evolutions
import slick.jdbc.PostgresProfile.api._
import util.AsyncHelpers.await

trait PostgresHelpers extends Suite with GuiceFakeApplicationFactory with BeforeAndAfterAll with BeforeAndAfterEach {

  private[this] val driver = "slick.jdbc.PostgresProfile"

  private[this] val testDbName = "default"
  private[this] val setupJdbcUrl = s"jdbc:postgresql://localhost:5903/$testDbName"
  private[this] val testDbUser = "postgres"
  private[this] val testDbPassword = "postgres"
  // This db is used for initial connection only (for setup purposes)
//  private[this] val dbSetup = Database.forURL(setupJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)
  implicit val db: Database = Database.forURL(setupJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)

  //This is needed for applying evolutions.
  val database = Databases(
    driver = "org.postgresql.Driver",
    url = s"jdbc:postgresql://localhost:5903/$testDbName",
    name = testDbName,
    config = Map(
      "user" -> "postgres",
      "password" -> "postgres"
    )
  )

  override def beforeAll() {
    await(db.run(DBIO.seq(
      sqlu"DROP DATABASE IF EXISTS #$testDbName",
      sqlu"CREATE DATABASE #$testDbName")))
    Evolutions.applyEvolutions(database)
  }

  override def beforeEach() {
//    DbConstants.setup(db)
  }
  override def afterEach() {
//    await(db.run(Tables.schema.drop))
  }

  override def afterAll() {
    await(db.run(sqlu"DROP DATABASE #$testDbName"))
  }
}
