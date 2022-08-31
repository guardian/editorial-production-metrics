package controllers

import com.gu.pandahmac.HMACAuthActions
import com.gu.pandomainauth.model.AuthenticatedUser

trait PanDomainAuthActions extends HMACAuthActions {
  override def validateUser(authedUser: AuthenticatedUser): Boolean =
    (authedUser.user.email endsWith "@guardian.co.uk") && authedUser.multiFactor
}
