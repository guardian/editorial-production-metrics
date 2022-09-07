package database

import config.AppConfig
import slick.basic.DatabaseConfig
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._

trait DatabaseConfiguration{
  val config: AppConfig
  private lazy val dbConfig: DatabaseConfig[PostgresProfile] = DatabaseConfig.forConfig("slick.dbs.default", config.config)
  implicit lazy val db: Database = dbConfig.db
}
