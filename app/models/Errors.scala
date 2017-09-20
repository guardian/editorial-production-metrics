package models

sealed abstract class ProductionMetricsError(val message: String)

case class InvalidJsonError(override val message: String) extends ProductionMetricsError(message)
case object UnexpectedExceptionError extends ProductionMetricsError("App hit an exception it did not expect.")
case object NoRequestBodyError extends ProductionMetricsError("Request did not have a body.")
case object ItemDoesNotExistError extends ProductionMetricsError("This item could not be found in the database.")
case class CannotDeserializeKinesisEvent(override val message: String) extends ProductionMetricsError(message)
case object UnexpectedDbExceptionError extends ProductionMetricsError("App hit an exception it did not expect when talking to the db.")
case object InvalidOriginatingSystem extends ProductionMetricsError("The valid values for originating system are: composer and incopy.")
