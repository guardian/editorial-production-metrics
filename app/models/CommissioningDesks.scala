package models

case class CommissioningDesks(total: Int, data: List[CommissioningDesk])

case class CommissioningDesk(data: CommissioningDeskData)

case class CommissioningDeskData(path: String)