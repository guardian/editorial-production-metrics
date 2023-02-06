import scala.sys.process._

name := "editorial-production-metrics"
version := "1.0"

ThisBuild / scalaVersion := "2.13.10"

scalacOptions ++= Seq(
  "-deprecation",
  "-Ywarn-unused:imports")

lazy val awsVersion = "1.11.678"

val databaseDependencies = Seq(
  ws,
  evolutions,
  jdbc,
  "com.typesafe.slick"   %% "slick"             % "3.3.3",
  "com.typesafe.slick"   %% "slick-hikaricp"    % "3.3.3",
  "com.github.tototoshi" %% "slick-joda-mapper" % "2.6.0",
  "org.postgresql"       % "postgresql"         % "9.4-1206-jdbc41",
  "joda-time"            % "joda-time"          % "2.7",
  "org.joda"             % "joda-convert"       % "1.7"
)

lazy val sharedDependencies = Seq(
  "com.amazonaws"          % "aws-java-sdk-core"                 % awsVersion,
  "com.amazonaws"          % "amazon-kinesis-client"             % "1.7.6",
  "com.gu"                 %% "editorial-production-metrics-lib" % "0.20-SNAPSHOT"
)

// these Jackson dependencies are required to resolve issues in Play 2.8.x https://github.com/orgs/playframework/discussions/11222
lazy val jacksonVersion = "2.13.4"
lazy val jacksonDatabindVersion = "2.13.4.2"
val jacksonOverrides = Seq(
  "com.fasterxml.jackson.core" % "jackson-core",
  "com.fasterxml.jackson.core" % "jackson-annotations",
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8",
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310",
  "com.fasterxml.jackson.module" %% "jackson-module-scala",
).map(_ % jacksonVersion)

val jacksonDatabindOverrides = Seq(
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
)

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging, SystemdPlugin)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    libraryDependencies ++= Seq(
      "com.dripower"           %% "play-circe"                   % "2814.2",
      "ch.qos.logback"         % "logback-core"                  % "1.2.7",
      "ch.qos.logback"         % "logback-classic"               % "1.2.7",
      "com.amazonaws"          % "aws-java-sdk-ec2"              % awsVersion,
      "net.logstash.logback"   % "logstash-logback-encoder"      % "6.6",
      "com.gu"                 %% "simple-configuration-ssm"     % "1.5.6",
      "com.gu"                 %% "panda-hmac-play_2-8"          % "2.1.0",
      "org.postgresql"         % "postgresql"                    % "42.1.1",
      "org.scalatest"          %% "scalatest"                    % "3.2.15" % "test",
      "org.mockito"            % "mockito-core"                  % "1.9.5" % "test"
    ) ++ sharedDependencies ++ databaseDependencies ++ jacksonOverrides ++ jacksonDatabindOverrides,
    routesGenerator := InjectedRoutesGenerator,

    Universal / name := normalizedName.value,
    topLevelDirectory := Some(normalizedName.value),
    riffRaffPackageName := name.value,
    riffRaffManifestProjectName := s"editorial-tools:${name.value}",
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),

    riffRaffPackageType := (Debian / packageBin).value,

    debianPackageDependencies := Seq("openjdk-8-jre-headless"),
    maintainer := "Editorial Tools <digitalcms.dev@guardian.co.uk>",
    packageSummary := "Editorial Production Metrics",
    packageDescription := """Metrics about the editorial production process""",

    Universal / javaOptions ++= Seq(
      "-Dpidfile.path=/dev/null"
    )
  )
  .configs(IntegrationTests)
  .settings(inConfig(IntegrationTests)(Defaults.testSettings) : _*)

lazy val IntegrationTests = config("it").extend(Test)

IntegrationTests / sourceDirectory := baseDirectory.value / "/test-integration"

IntegrationTests / javaSource := baseDirectory.value / "/test-integration"

IntegrationTests / resourceDirectory := baseDirectory.value / "/test-integration/resources"

IntegrationTests / scalaSource := baseDirectory.value / "/test-integration"

IntegrationTests / testOptions += Tests.Setup(_ => {
  println(s"Launching docker container with PostgreSQL")
  s"docker-compose up -d".!

  // This is needed to ensure docker has had enough time to start up
  Thread.sleep(5000)
})

addCommandAlias("testAll", "; test ; it:test")

lazy val kinesisLocal = Project("kinesis-local", file("kinesisLocal"))
  .settings(libraryDependencies ++= sharedDependencies)
