package models

case class CommissioningDesks(data: List[CommissioningDesk])

case class CommissioningDesk(data: CommissioningDeskData)

case class CommissioningDeskData(path: String)