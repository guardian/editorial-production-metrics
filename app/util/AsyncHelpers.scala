package util

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
  def await[A](result: Future[A]): A = Await.result(io(result), maxWait)

}