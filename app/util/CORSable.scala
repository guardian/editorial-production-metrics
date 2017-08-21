package util

import play.api.mvc.{Action, BodyParser, Request, Result}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class CORSable[A](origins: String*)(action: Action[A]) extends Action[A] {

  lazy val parser: BodyParser[A] = action.parser

  def apply(request: Request[A]): Future[Result] = {
    println("checks cors", origins, request.headers)
    val headers = request.headers.get("Origin").map { origin =>
      println("origin", origin)
      if(origins.contains(origin)) {
        println("contains? yes")
        List("Access-Control-Allow-Origin" -> origin, "Access-Control-Allow-Credentials" -> "true")
      } else { Nil }
    }
    action(request).map(_.withHeaders(headers.getOrElse(Nil) :_*))
  }
}