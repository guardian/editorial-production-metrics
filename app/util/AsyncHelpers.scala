package util

import models.{FailedFutureError, ProductionMetricsError}
import play.api.Logger

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

object AsyncHelpers {
  private def io[A](future: Future[A]): Future[A] = {
    future.failed.foreach(e => Logger.error(s"Error when running query; message: ${e.getMessage}", e))
    future
  }

  private val maxWait: FiniteDuration = 15.seconds
  def awaitWithTransformation[A, B](result: Future[A])(transformation: A => B): Either[ProductionMetricsError, B] = {
    val future: Future[Either[ProductionMetricsError, B]] = io(result)
      .map { r => Right(transformation(r)) }
      .recover { case err => Left(FailedFutureError(err.getMessage)) }
    Await.result(future, maxWait)
  }
  def await[A](result: Future[A]): Either[ProductionMetricsError, A] = awaitWithTransformation[A, A](result)(identity)
}


