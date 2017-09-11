package database

import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._

object DatabaseConfiguration{
  private lazy val dbConfig: DatabaseConfig[PostgresProfile] = DatabaseConfig.forConfig("slick.dbs.default")
  implicit lazy val db: Database = dbConfig.db
}
