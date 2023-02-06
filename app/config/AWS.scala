package config

import com.amazonaws.regions.{Region, Regions}
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}

object AWS {
  val profile = "composer"
  val region: Region = Option(Regions.getCurrentRegion).getOrElse(Region.getRegion(Regions.EU_WEST_1))
  val credentials: AwsCredentialsProviderChain = AwsCredentialsProviderChain.builder().credentialsProviders(
    ProfileCredentialsProvider.create(profile),
    InstanceProfileCredentialsProvider.create()
  ).build()
}
