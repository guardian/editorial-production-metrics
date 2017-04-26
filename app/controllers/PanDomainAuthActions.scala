package controllers

import com.amazonaws.auth.AWSCredentialsProvider
import com.gu.pandomainauth.action.AuthActions
import com.gu.pandomainauth.model.AuthenticatedUser
import config.Config

trait PanDomainAuthActions extends AuthActions {

  override def validateUser(authedUser: AuthenticatedUser): Boolean =
    (authedUser.user.email endsWith "@guardian.co.uk") && authedUser.multiFactor

  override def authCallbackUrl: String = Config.pandaAuthCallback

  override def domain: String = Config.pandaDomain

  override lazy val system: String = Config.pandaSystem

  override def awsCredentialsProvider: AWSCredentialsProvider = Config.awsCredentialsProvider

}
