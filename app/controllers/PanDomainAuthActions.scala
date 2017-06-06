package controllers

import com.amazonaws.auth.AWSCredentialsProvider
import com.gu.pandomainauth.action.AuthActions
import com.gu.pandomainauth.model.AuthenticatedUser
import config.Config

trait PanDomainAuthActions extends AuthActions {

  def config: Config

  override def validateUser(authedUser: AuthenticatedUser): Boolean =
    (authedUser.user.email endsWith "@guardian.co.uk") && authedUser.multiFactor

  override def authCallbackUrl: String = config.pandaAuthCallback

  override def domain: String = config.pandaDomain

  override lazy val system: String = config.pandaSystem

  override def awsCredentialsProvider: AWSCredentialsProvider = config.awsCredentialsProvider

}
