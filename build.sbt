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
      "io.getquill"            % "quill-jdbc_2.11"               % "1.2.1",
      "com.amazonaws"          % "amazon-kinesis-client"         % "1.7.3",
      "org.apache.thrift"      % "libthrift"                     % "0.9.2",
      "com.twitter"            %% "scrooge-core"                 % "3.17.0"
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
      "com.typesafe.play"      %% "play-json"                    % "2.6.0",
// jackson-dataformat-cbor is required to resolve an incompatability between the version used in play-json and the one used in amazon-kinesis-client
      "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % "2.8.8"
    )
  )
