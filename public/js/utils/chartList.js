export const CHART_FILTERS_MAP = {
  "InWorkflowVsNotInWorkflow": ["startDate", "endDate", "desk", "productionOffice"],
  "ComposerVsIncopy": ["startDate", "endDate", "desk", "productionOffice"],
  "ForkTime": ["startDate", "endDate", "newspaperBook"],
  "WordCount": ["startDate", "endDate", "desk", "productionOffice"],
  "CommissionedLength": ["startDate", "endDate", "desk", "productionOffice"],
  "WordCountArticles": ["startDate", "endDate", "desk", "productionOffice"],
};

export const CHART_LIST = Object.keys(CHART_FILTERS_MAP);
