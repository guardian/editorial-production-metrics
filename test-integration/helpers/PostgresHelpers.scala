package helpers

import org.scalatest.{BeforeAndAfterAll, BeforeAndAfterEach, Suite}
import slick.jdbc.PostgresProfile.api._
import util.AsyncHelpers.await

import scala.util.Random
import config.Config._
import play.api.db.{DBApi, Databases}
import play.api.db.evolutions.Evolutions
import play.api.inject.guice.GuiceApplicationBuilder

trait PostgresHelpers extends Suite with BeforeAndAfterAll with BeforeAndAfterEach {

  lazy val appBuilder = new GuiceApplicationBuilder()

  lazy val injector = appBuilder.injector()

  lazy val databaseApi = injector.instanceOf[DBApi]

  val database = Databases(
    driver = "org.postgresql.Driver",
    url = "jdbc:postgresql://localhost:5903/metricsdb",
    name = testDbName,
    config = Map(
      "user" -> "postgres",
      "password" -> "postgres"
    )
  )
  val d = databaseApi.database("metricsdb")

  private[this] val driver = "slick.jdbc.PostgresProfile"

  private[this] val setupJdbcUrl = "jdbc:postgresql://localhost:5903/metricsdb"

  private[this] val testDbName = "metricsdb"//Random.alphanumeric.take(10).mkString.replaceAll("[0-9]", "").toLowerCase
  //  private[this] val testJdbcUrl = setupJdbcUrl.take(setupJdbcUrl.lastIndexOf("/") + 1) + testDbName // replace setupDbName with random one
  private[this] val testDbUser = "postgres"
  private[this] val testDbPassword = "postgres"
  // This db is used for initial connection only (for setup purposes)
  private[this] val dbSetup = Database.forURL(setupJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)

  implicit val db: Database = Database.forURL(setupJdbcUrl, driver = driver, user = testDbUser, password = testDbPassword)



  override def beforeAll() {
//    println("config", config)
    await(dbSetup.run(DBIO.seq(
      sqlu"DROP DATABASE IF EXISTS #$testDbName",
      sqlu"CREATE DATABASE #$testDbName")))
//    Evolutions.applyEvolutions(databaseApi.database("metricsdb"))
  }

  override def beforeEach() {
//    await(db.run(Tables.schema.create))
//    DbConstants.setup(db)
  }
  override def afterEach() {
//    await(db.run(Tables.schema.drop))
  }

  override def afterAll() {
//    Evolutions.cleanupEvolutions(database)
//    db.close()
//    dbSetup.close()
//    databaseApi.database("metricsdb").shutdown()
//    await(dbSetup.run(sqlu"SELECT pg_terminate_backend(procpid) FROM pg_stat_activity WHERE datname = #$testDbName"))
    await(dbSetup.run(sqlu"DROP DATABASE #$testDbName"))
  }
}
