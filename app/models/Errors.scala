package models

sealed abstract class ProductionMetricsError(val message: String)

case class InvalidJsonError(override val message: String) extends ProductionMetricsError(message)
case object UnexpectedExceptionError extends ProductionMetricsError("App hit an exception it did not expect.")
case object NoRequestBodyError extends ProductionMetricsError("Request did not have a body.")
case object ItemDoesNotExistError extends ProductionMetricsError("This item could not be found in the database.")