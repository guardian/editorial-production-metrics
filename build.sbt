import com.typesafe.sbt.packager.archetypes.ServerLoader.Systemd

name := "editorial-production-metrics"
version := "1.0"

scalaVersion in ThisBuild := "2.11.11"

resolvers ++= Seq("Guardian Bintray" at "https://dl.bintray.com/guardian/editorial-tools")

scalacOptions ++= Seq(
  "-deprecation",
  "-Ywarn-unused-import")

lazy val awsVersion = "1.11.678"

val databaseDependencies = Seq(
  ws,
  evolutions,
  jdbc,
  "com.typesafe.slick"   %% "slick"             % "3.2.1",
  "com.typesafe.slick"   %% "slick-hikaricp"    % "3.2.1",
  "com.github.tototoshi" %% "slick-joda-mapper" % "2.3.0",
  "org.postgresql"       % "postgresql"         % "9.4-1206-jdbc41",
  "joda-time"            % "joda-time"          % "2.7",
  "org.joda"             % "joda-convert"       % "1.7"
)

lazy val sharedDependencies = Seq(
  "com.amazonaws"          % "aws-java-sdk-core"                 % awsVersion,
  "com.amazonaws"          % "amazon-kinesis-client"             % "1.7.6",
  "io.circe"               %% "circe-parser"                     % "0.8.0",
  "io.circe"               %% "circe-generic"                    % "0.8.0",
  "com.beachape"           %% "enumeratum-circe"                 % "1.5.14",
  "com.gu"                 %% "editorial-production-metrics-lib" % "0.17"
)

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    libraryDependencies ++= Seq(
      "com.gu"                 % "kinesis-logback-appender"      % "1.3.0",
      "com.amazonaws"          % "aws-java-sdk-ec2"              % awsVersion,
      "net.logstash.logback"   % "logstash-logback-encoder"      % "4.2",
      "com.gu"                 %% "configuration-magic-core"     % "1.3.0",
      "com.gu"                 %% "configuration-magic-play2-4"  % "1.3.0",
      "com.gu"                 %% "panda-hmac"                   % "1.2.0",
      "org.postgresql"         % "postgresql"                    % "42.1.1",
      "org.scalatest"          %% "scalatest"                    % "3.0.1" % "test",
      "org.mockito"            % "mockito-core"                  % "1.9.5" % "test"
    ) ++ sharedDependencies ++ databaseDependencies,
    routesGenerator := InjectedRoutesGenerator,

    serverLoading in Debian := Systemd,

    name in Universal := normalizedName.value,
    topLevelDirectory := Some(normalizedName.value),
    riffRaffPackageName := name.value,
    riffRaffManifestProjectName := s"editorial-tools:${name.value}",
    riffRaffBuildIdentifier :=  Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV"),
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),
    riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch"),

    riffRaffPackageType := (packageBin in Debian).value,

    debianPackageDependencies := Seq("openjdk-8-jre-headless"),
    maintainer := "Editorial Tools <digitalcms.dev@guardian.co.uk>",
    packageSummary := "Editorial Production Metrics",
    packageDescription := """Metrics about the editorial production process""",

    javaOptions in Universal ++= Seq(
      "-Dpidfile.path=/dev/null"
    )
  )
  .configs(IntegrationTests)
  .settings(inConfig(IntegrationTests)(Defaults.testSettings) : _*)

lazy val IntegrationTests = config("it").extend(Test)

sourceDirectory in IntegrationTests := baseDirectory.value / "/test-integration"

javaSource in IntegrationTests := baseDirectory.value / "/test-integration"

resourceDirectory in IntegrationTests := baseDirectory.value / "/test-integration/resources"

scalaSource in IntegrationTests := baseDirectory.value / "/test-integration"

testOptions in IntegrationTests += Tests.Setup(_ => {
  println(s"Launching docker container with PostgreSQL")
  s"docker-compose up -d".!

  // This is needed to ensure docker has had enough time to start up
  Thread.sleep(5000)
})

addCommandAlias("testAll", "; test ; it:test")

lazy val kinesisLocal = (project in file("kinesisLocal"))
  .settings(
    name := "kinesis-local",
    libraryDependencies ++= sharedDependencies
  )
