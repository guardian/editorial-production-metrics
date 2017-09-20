import chartList from 'utils/chartList';
import api from 'services/Api';
import { reEstablishSession } from 'panda-session';

/*-------- CHARTS --------*/

const updateComposerVsIncopy = ({ chartData, startDate, endDate }) => ({
    type: 'UPDATE_COMPOSER_VS_INCOPY',
    chartData,
    startDate,
    endDate
});
//remeber to pass error.message to these functions
const getComposerVsIncopyFailed = (error) => ({
    type: 'GET_COMPOSER_VS_INCOPY_FAILED',
    error
});

const updateInWorkflowVsNotInWorkflow = ({ chartData, startDate, endDate }) => ({
    type: 'UPDATE_IN_WORKFLOW_VS_NOT_IN_WORKFLOW',
    chartData,
    startDate,
    endDate
});

const getInWorkflowVsNotInWorkflowFailed = (error) => ({
    type: 'GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED',
    error
});

/*-------- SWITCHES --------*/

const toggleStackChart = (isStacked) => ({
    type: 'TOGGLE_STACK_CHART',
    isStacked
});

/*-------- FILTERS --------*/

const updateFilter = (filterObj) => ({
    type: 'UPDATE_FILTER',
    filterObj
});

const updateCommissioningDesks = (desksList) => ({
    type: 'UPDATE_COMMISSIONING_DESKS',
    desksList
});

const getCommissioningDesksFailed = (error) => ({
    type: 'GET_COMMISSIONING_DESKS_FAILED',
    error
});

/*-------- UI --------*/

const toggleIsUpdatingCharts = (isUpdating) => ({
    type: 'TOGGLE_IS_UPDATING_CHARTS',
    isUpdating
});

/*-------- ASYNC --------*/

const chartsActions = { 
    updateComposerVsIncopy,
    getComposerVsIncopyFailed,
    updateInWorkflowVsNotInWorkflow,
    getInWorkflowVsNotInWorkflowFailed
};

const updateAttemptActions = (chartData, chart, startDate, endDate, dispatch) => {
    dispatch(toggleIsUpdatingCharts(false));
    dispatch(chartsActions[`update${chart}`]({ chartData, startDate, endDate }));
};

const responseFailActions = (chart, error, dispatch) => {
    dispatch(toggleIsUpdatingCharts(false));
    dispatch(chartsActions[`get${chart}Failed`](error));
};

const filterDesk = (filterObj = {}) => {
    return (dispatch) => {
        dispatch(updateFilter(filterObj));
        dispatch(toggleIsUpdatingCharts(true));
        const { startDate, endDate, desk, productionOffice } = filterObj;
        chartList.map(chart => {
            api[`get${chart}`](startDate, endDate, desk, productionOffice)
                .then(chartData => updateAttemptActions(chartData, chart, startDate, endDate, dispatch))
                .catch(error => {
                    const status = error.response.status;
                    if (status === 419) {
                        reEstablishSession('/reauth', 5000)
                            .then(
                                () => {
                                    api[`get${chart}`](startDate, endDate, desk, productionOffice)
                                        .then(chartData => updateAttemptActions(chartData, chart, startDate, endDate, dispatch));
                                },
                                error => responseFailActions(chart, error, dispatch)
                            );
                    } else {
                        responseFailActions(chart, error, dispatch);
                    }
                });
        });

    };
};

const fetchCommissioningDesks = () => {
    return (dispatch) => {
        api.getCommissioningDesks()
            .then(response => {
                const desksList = response.data;
                desksList.push('tracking/commissioningdesk/all');
                dispatch(updateCommissioningDesks(desksList));
            })
            .catch(dispatch(getCommissioningDesksFailed));
    };
};

const actions = { toggleStackChart, filterDesk, fetchCommissioningDesks };

export default actions;