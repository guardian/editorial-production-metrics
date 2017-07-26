package models.db

import io.getquill.{PostgresJdbcContext, SnakeCase}

class MetricsQuery(dbContext: PostgresJdbcContext[SnakeCase]) {
  def filterMetrics(implicit filters: MetricsFilters): Metric => Boolean = m =>
    filters.desk.fold(true)(d => m.userDesk.contains(d))

  def applyFilters(q: dbContext.EntityQuery[Metric])(implicit filters: MetricsFilters): dbContext.EntityQuery[Metric] = ???
}
