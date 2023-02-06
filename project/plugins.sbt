addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.18")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

libraryDependencies += "org.vafer" % "jdeb" % "1.10" artifacts Artifact("jdeb", "jar", "jar")

addSbtPlugin("ch.epfl.scala" % "sbt-scalafix" % "0.10.4")

addDependencyTreePlugin

/*
   scala-xml has been updated to 2.x in sbt, but not in other sbt plugins like sbt-native-packager
   See: https://github.com/scala/bug/issues/12632
   This is effectively overrides the safeguards (early-semver) put in place by the library authors ensuring binary compatibility.
   We consider this a safe operation because when set under `projects/` (ie *not* in `build.sbt` itself) it only affects the
   compilation of build.sbt, not of the application build itself.
   Once the build has succeeded, there is no further risk (ie of a runtime exception due to clashing versions of `scala-xml`).
 */
libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always