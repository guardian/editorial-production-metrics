const initialState = {
    composerVsInCopy: {
        chartData: {},
        startDate: null,
        endDate: null,
        pending: true,
        isStacked: true
    },
    inWorkflowVsNotInWorkflow: {
        chartData: {},
        startDate: null,
        endDate: null,
        pending: true,
        isStacked: true
    },
    forkTime: {
        chartData: {},
        startDate: null,
        pending: true,
        endDate: null,
    },
    wordCount: {
        chartData: {},
        startDate: null,
        pending: true,
        endDate: null,
    },
    commissionedLength: {
        chartData: {},
        startDate: null,
        pending: true,
        endDate: null,
    }
};

const chartError = (key, state, { error }) => ({
    ...state,
    [key]: {
        ...state[key],
        error,
    }
});

const chartUpdate = (key, state, { startDate, endDate, chartData }) => ({
    ...state,
    [key]: {
        ...state[key],
        startDate,
        endDate,
        chartData,
        pending: false
    }
});

const charts = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
    case 'UPDATE_COMPOSER_VS_INCOPY':
        return chartUpdate("composerVsInCopy", state, payload);

    case 'GET_COMPOSER_VS_INCOPY_FAILED':
        return chartError("composerVsInCopy", state, payload);

    case 'TOGGLE_STACK_CHART':
        return {
            ...state,
            composerVsInCopy: {
                ...state.composerVsInCopy,
                isStacked: payload.isStacked
            }
        };

    case 'UPDATE_IN_WORKFLOW_VS_NOT_IN_WORKFLOW':
        return chartUpdate("inWorkflowVsNotInWorkflow", state, payload);

    case 'GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED':
        return chartError("inWorkflowVsNotInWorkflow", state, payload);
        
    case 'UPDATE_FORK_TIME':
        return chartUpdate("forkTime", state, payload);

    case 'GET_FORK_TIME_FAILED':
        return chartError("forkTime", state, payload);

    case "UPDATE_WORD_COUNT":
        return chartUpdate("wordCount", state, payload);

    case "GET_WORD_COUNT_FAILED":
        return chartError("wordCount", state, payload);

    case "UPDATE_COMMISSIONED_LENGTH":
        return chartUpdate("commissionedLength", state, payload);

    case "GET_COMMISSIONED_LENGTH_FAILED":
        return chartError("commissionedLength", state, payload);

    default:
        return state;
    }
};

export default charts;