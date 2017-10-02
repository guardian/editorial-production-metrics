package controllers

import com.amazonaws.auth.AWSCredentialsProvider
import com.gu.pandahmac.HMACAuthActions
import com.gu.pandomainauth.model.AuthenticatedUser
import config.Config._

trait PanDomainAuthActions extends HMACAuthActions {

  override def validateUser(authedUser: AuthenticatedUser): Boolean =
    (authedUser.user.email endsWith "@guardian.co.uk") && authedUser.multiFactor

  override def authCallbackUrl: String = pandaAuthCallback

  override def domain: String = pandaDomain

  override lazy val system: String = pandaSystem

  override def awsCredentialsProvider: AWSCredentialsProvider = awsCredsProvider

  override def secret: String = hmacSecret

}
