const initialState = {
    composerVsInCopy: {
        data: {
            absolute: [],
            percent: []
        },
        isStacked: true
    },
    inWorkflowVsNotInWorkflow: {
        data: {
            absolute: [],
            percent: []
        },
        isStacked: true
    },
    forkTime: {
        data: {
            absolute: []
        }
    }
};

const charts = (state = initialState, action) => {
    const { type, absolute, percent, error, isStacked } = action;
    switch (type) {
    case 'UPDATE_COMPOSER_VS_INCOPY': {
        return {
            ...state,
            composerVsInCopy: {
                ...state.composerVsInCopy,
                data: {
                    absolute,
                    percent
                }
            }
        };
    }
    case 'GET_COMPOSER_VS_INCOPY_FAILED':
        return Object.assign({}, state, { composerVsInCopy: { ...state.composerVsInCopy, error }});

    case 'TOGGLE_STACK_CHART':
        return Object.assign({}, state, { composerVsInCopy: { ...state.composerVsInCopy, isStacked }});

    case 'UPDATE_IN_WORKFLOW_VS_NOT_IN_WORKFLOW': {
        return {
            ...state,
            inWorkflowVsNotInWorkflow: {
                ...state.inWorkflowVsNotInWorkflow,
                data: {
                    absolute,
                    percent
                }
            }
        };  
    }
    case 'GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED':
        return Object.assign({}, state, { inWorkflowVsNotInWorkflow: { ...state.inWorkflowVsNotInWorkflow, error }});
        
    case 'UPDATE_FORK_TIME': {
        return {
            ...state,
            forkTime: {
                data: {
                    absolute
                }
            }
        };
    }
    case 'GET_FORK_TIME_FAILED': 
        return Object.assign({}, state, { forkTime: { ...state.forkTime, error }});

    default:
        return state;
    }
};

export default charts;