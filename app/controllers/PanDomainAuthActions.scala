package controllers

import com.gu.pandahmac.HMACAuthActions
import com.gu.pandomainauth.model.AuthenticatedUser

trait PanDomainAuthActions extends HMACAuthActions {
  val pandaAuthCallback: String
  val hmacSecret: String

  override def validateUser(authedUser: AuthenticatedUser): Boolean =
    (authedUser.user.email endsWith "@guardian.co.uk") && authedUser.multiFactor

  override def authCallbackUrl: String = pandaAuthCallback

  override def secret: String = hmacSecret

}
