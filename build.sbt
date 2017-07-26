import com.typesafe.sbt.packager.archetypes.ServerLoader.Systemd

name := "editorial-production-metrics"
version := "1.0"

scalaVersion := "2.11.8"

lazy val awsVersion = "1.11.77"

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    libraryDependencies ++= Seq(
      ws,
      evolutions,
      jdbc,
      "com.amazonaws"          % "aws-java-sdk-core"             % awsVersion,
      "com.gu"                 % "kinesis-logback-appender"      % "1.3.0",
      "com.amazonaws"          % "aws-java-sdk-ec2"              % awsVersion,
      "net.logstash.logback"   % "logstash-logback-encoder"      % "4.2",
      "com.gu"                 %% "configuration-magic-core"     %  "1.3.0",
      "com.gu"                 %% "configuration-magic-play2-4"  % "1.3.0",
      "com.gu"                 %% "pan-domain-auth-play_2-5"     % "0.4.1",
      "org.postgresql"         % "postgresql"                    % "42.1.1",
      "io.circe"               %% "circe-parser"                 % "0.7.0",
      "io.circe"               %% "circe-generic"                % "0.7.0",
      "com.beachape"           %% "enumeratum-circe"             % "1.5.14",
      "org.postgresql"         % "postgresql"                    % "42.1.1",
      "io.getquill"            %% "quill-jdbc"                   % "1.3.0",
      "com.amazonaws"          % "amazon-kinesis-client"         % "1.7.6"
    ),
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
    packageDescription := """A single place for atoms of all types""",

    riffRaffArtifactResources ++= Seq(
      baseDirectory.value / "cloudformation" / "EditorialProductionMetrics.yml" -> s"packages/cloudformation/EditorialProductionMetrics.yml"
    ),
    javaOptions in Universal ++= Seq(
      "-Dpidfile.path=/dev/null"
    )
  )

lazy val kinesisLocal = (project in file("kinesisLocal"))
  .settings(
    name := "kinesis-local",
    scalaVersion := "2.11.8",
    libraryDependencies ++= Seq(
      "com.amazonaws"          % "aws-java-sdk-core"             % awsVersion,
      "com.amazonaws"          % "amazon-kinesis-client"         % "1.7.6",
      "io.circe"               %% "circe-parser"                 % "0.7.0",
      "io.circe"               %% "circe-generic"                % "0.7.0",
      "com.beachape"           %% "enumeratum-circe"             % "1.5.14"
    )
  )
