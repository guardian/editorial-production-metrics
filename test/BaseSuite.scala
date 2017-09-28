import java.util.TimeZone

import org.scalatest.{FunSuite, Matchers}

class BaseSuite extends FunSuite with Matchers {
  System.setProperty("user.timezone", "UTC")
  TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
}