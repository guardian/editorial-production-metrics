import com.typesafe.sbt.packager.archetypes.ServerLoader.Systemd

name := "editorial-production-metrics"
version := "1.0"

scalaVersion := "2.11.8"

lazy val awsVersion = "1.11.77"

val databaseDependencies = Seq(
  ws,
  evolutions,
  jdbc,
  "com.typesafe.slick" %% "slick" % "3.2.1",
  "com.typesafe.slick" %% "slick-hikaricp" % "3.2.1",
  "com.github.tototoshi" %% "slick-joda-mapper" % "2.3.0"
)

lazy val sharedDependencies = Seq(
  "com.amazonaws"          % "aws-java-sdk-core"             % awsVersion,
  "com.amazonaws"          % "amazon-kinesis-client"         % "1.7.6",
  "io.circe"               %% "circe-parser"                 % "0.7.0",
  "io.circe"               %% "circe-generic"                % "0.7.0",
  "com.beachape"           %% "enumeratum-circe"             % "1.5.14",
  "com.gu" %% "editorial-production-metrics-lib" % "0.1-SNAPSHOT"
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
      "org.postgresql"         % "postgresql"                    % "42.1.1"
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

lazy val kinesisLocal = (project in file("kinesisLocal"))
  .settings(
    name := "kinesis-local",
    scalaVersion := "2.11.8",
    libraryDependencies ++= sharedDependencies
  )
