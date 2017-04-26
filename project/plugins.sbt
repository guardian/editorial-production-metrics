logLevel := Level.Warn

resolvers += "Typesafe repository" at "https://dl.bintray.com/typesafe/maven-releases/"

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.5.9")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "0.9.7")
