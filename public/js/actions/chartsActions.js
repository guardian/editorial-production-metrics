const updateChartData = type => (chartData, startDate, endDate) => ({
    type,
    payload: {
        chartData,
        startDate,
        endDate
    }
});

const chartDataRequestFailed = type => error => ({
    type,
    payload: {
        error
    }
});

/* UPDATES */
export const updateComposerVsIncopy = updateChartData(
    "UPDATE_COMPOSER_VS_INCOPY"
);
export const updateInWorkflowVsNotInWorkflow = updateChartData(
    "UPDATE_IN_WORKFLOW_VS_NOT_IN_WORKFLOW"
);
export const updateForkTime = updateChartData("UPDATE_FORK_TIME");
export const updateWordCount = updateChartData("UPDATE_WORD_COUNT");
export const updateCommissionedLength = updateChartData(
    "UPDATE_COMMISSIONED_LENGTH"
);
export const updateWordCountArticles = updateChartData(
    "UPDATE_WORD_COUNT_ARTICLES"
);

/* FAILURES */
export const getComposerVsIncopyFailed = chartDataRequestFailed(
    "GET_COMPOSER_VS_INCOPY_FAILED"
);
export const getInWorkflowVsNotInWorkflowFailed = chartDataRequestFailed(
    "GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED"
);
export const getForkTimeFailed = chartDataRequestFailed("GET_FORK_TIME_FAILED");
export const getWordCountFailed = chartDataRequestFailed(
    "GET_WORD_COUNT_FAILED"
);
export const getCommissionedLengthFailed = chartDataRequestFailed(
    "GET_COMMISSIONED_LENGTH_FAILED"
);
export const getWordCountArticlesFailed = chartDataRequestFailed(
    "GET_WORD_COUNT_ARTICLES_FAILED"
);
