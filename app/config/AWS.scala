package config

import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}

object AWS {
  val profile = "composer"
  val credentials: AwsCredentialsProviderChain = AwsCredentialsProviderChain.builder().credentialsProviders(
    ProfileCredentialsProvider.create(profile),
    InstanceProfileCredentialsProvider.create()
  ).build()
}
