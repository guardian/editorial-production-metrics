package controllers

import play.api.mvc.{BaseController, ControllerComponents}

class Healthcheck(val controllerComponents: ControllerComponents) extends BaseController {

  def healthcheck = Action {
    Ok("Healthcheck")
  }

}
