export const updateComposerVsIncopy = ({ chartData, startDate, endDate }) => ({
    type: 'UPDATE_COMPOSER_VS_INCOPY',
    chartData,
    startDate,
    endDate
});
//remeber to pass error.message to these functions
export const getComposerVsIncopyFailed = (error) => ({
    type: 'GET_COMPOSER_VS_INCOPY_FAILED',
    error
});

export const updateInWorkflowVsNotInWorkflow = ({ chartData, startDate, endDate }) => ({
    type: 'UPDATE_IN_WORKFLOW_VS_NOT_IN_WORKFLOW',
    chartData,
    startDate,
    endDate
});

export const getInWorkflowVsNotInWorkflowFailed = (error) => ({
    type: 'GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED',
    error
});