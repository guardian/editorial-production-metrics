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

/* FAILURES */
export const getComposerVsIncopyFailed = chartDataRequestFailed(
    "GET_COMPOSER_VS_INCOPY_FAILED"
);
export const getInWorkflowVsNotInWorkflowFailed = chartDataRequestFailed(
    "GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED"
);
export const getForkTimeFailed = chartDataRequestFailed("GET_FORK_TIME_FAILED");
