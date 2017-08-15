import com.typesafe.sbt.packager.archetypes.ServerLoader.Systemd

name := "editorial-production-metrics"
version := "1.0"

scalaVersion := "2.11.8"

resolvers ++= Seq("Guardian Bintray" at "https://dl.bintray.com/guardian/editorial-tools")

lazy val awsVersion = "1.11.77"

val databaseDependencies = Seq(
  ws,
  evolutions,
  jdbc,
  "com.typesafe.slick"   %% "slick"             % "3.2.1",
  "com.typesafe.slick"   %% "slick-hikaricp"    % "3.2.1",
  "com.github.tototoshi" %% "slick-joda-mapper" % "2.3.0",
  "joda-time" % "joda-time" % "2.7",
  "org.joda" % "joda-convert" % "1.7"
)

lazy val sharedDependencies = Seq(
  "com.amazonaws"          % "aws-java-sdk-core"                 % awsVersion,
  "com.amazonaws"          % "amazon-kinesis-client"             % "1.7.6",
  "io.circe"               %% "circe-parser"                     % "0.8.0",
  "io.circe"               %% "circe-generic"                    % "0.8.0",
  "com.beachape"           %% "enumeratum-circe"                 % "1.5.14",
  "com.gu"                 %% "editorial-production-metrics-lib" % "0.14"
)

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    libraryDependencies ++= Seq(
      "com.gu"                 % "kinesis-logback-appender"      % "1.3.0",
      "com.amazonaws"          % "aws-java-sdk-ec2"              % awsVersion,
      "net.logstash.logback"   % "logstash-logback-encoder"      % "4.2",
      "com.gu"                 %% "configuration-magic-core"     %  "1.3.0",
      "com.gu"                 %% "configuration-magic-play2-4"  % "1.3.0",
      "com.gu"                 %% "pan-domain-auth-play_2-5"     % "0.4.1",
      "com.gu"                 %% "panda-hmac"                   % "1.2.0",
      "org.postgresql"         % "postgresql"                    % "42.1.1",
      "org.scalatestplus.play" %% "scalatestplus-play"           % "1.5.0" % "test",
      "org.mockito" % "mockito-core" % "2.8.47"
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

testOptions in IntegrationTests += Tests.Setup(loader => {
  val dbUser = "postgres"
  val dbPassword = "postgres"
  val dbName = "metrics"
  val dbPort = 6432

  ("docker rm -fv metricsdb" #|| "true").!
  s"docker run --name metricsdb -e POSTGRES_USER=$dbUser -e POSTGRES_PASSWORD=$dbPassword -e POSTGRES_DB=$dbName -p $dbPort:5432 -d postgres:9.4-alpine".!

  println("Waiting for Postgres to startup...")
  while("docker exec metricsdb pg_isready".! > 0) {
    Thread.sleep(1000)
  }
  Thread.sleep(5000)
})

addCommandAlias("testAll", "; test ; it:test")

lazy val kinesisLocal = (project in file("kinesisLocal"))
  .settings(
    name := "kinesis-local",
    scalaVersion := "2.11.8",
    libraryDependencies ++= sharedDependencies
  )
