logLevel := Level.Warn

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.0")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

libraryDependencies += "org.vafer" % "jdeb" % "1.6" artifacts (Artifact("jdeb", "jar", "jar"))

addSbtPlugin("ch.epfl.scala" % "sbt-scalafix" % "0.9.29") // final sbt 0.13.x version
dependencyOverrides += "ch.epfl.scala" % "scalafix-interfaces" % "0.10.0"