package util

import org.joda.time.DateTime
import slick.jdbc.PostgresProfile.api._

/** Typeclass for importing postgres specific operations.
  * Usage:
  * - Add the new operation in the trait
  * - Implement implicits for all the types that need to support that operation in the companion object
  * - Define a convenience method in the implicit class and call it with slickField.convenienceMethod
  * @tparam A - This is the type of the Slick column
  */

trait PostgresOpsImport[A <: Rep[_]] {
  def dateTruncOp: (Rep[String], A) => A
}

object PostgresOpsImport {
  implicit val dateTruncImplicit: PostgresOpsImport[Rep[DateTime]] = new PostgresOpsImport[Rep[DateTime]] {
    def dateTruncOp: (Rep[String], Rep[DateTime]) => Rep[DateTime] = SimpleFunction.binary[String, DateTime, DateTime]("date_trunc")
  }

  implicit val dateTruncOptImplicit: PostgresOpsImport[Rep[Option[DateTime]]] = new PostgresOpsImport[Rep[Option[DateTime]]] {
    def dateTruncOp: (Rep[String], Rep[Option[DateTime]]) => Rep[Option[DateTime]] = SimpleFunction.binary[String, Option[DateTime], Option[DateTime]]("date_trunc")
  }

  implicit class PostgresOps[A <: Rep[_]](data: A) {
    def toDayDateTrunc(implicit postgresOpsImport: PostgresOpsImport[A]): A = postgresOpsImport.dateTruncOp("day", data)
  }
}


