import chartList from 'utils/chartList';
import {
    updateComposerVsIncopy, 
    getComposerVsIncopyFailed, 
    updateInWorkflowVsNotInWorkflow,
    getInWorkflowVsNotInWorkflowFailed,
    updateForkTime,
    getForkTimeFailed

} from './chartsActions';
import { toggleIsUpdatingCharts } from './uiActions';
import { updateFilter, updateCommissioningDesks, getCommissioningDesksFailed } from './filtersActions';
import api from 'services/Api';

const chartsActions = { 
    updateComposerVsIncopy,
    getComposerVsIncopyFailed,
    updateInWorkflowVsNotInWorkflow,
    getInWorkflowVsNotInWorkflowFailed,
    updateForkTime,
    getForkTimeFailed
};

/*-------- HELPERS --------*/

const updateAttemptActions = (chartData, chart, startDate, endDate, dispatch) => {
    dispatch(toggleIsUpdatingCharts(false));
    dispatch(chartsActions[`update${chart}`]({ chartData, startDate, endDate }));
};

const responseFailActions = (chart, error, dispatch) => {
    dispatch(toggleIsUpdatingCharts(false));
    dispatch(chartsActions[`get${chart}Failed`](error));
};

/*-------- DISPATCHABLE --------*/

export const filterDesk = (filterObj = {}) => {
    return (dispatch) => {
        dispatch(updateFilter(filterObj));
        dispatch(toggleIsUpdatingCharts(true));
        const { startDate, endDate, desk, productionOffice } = filterObj;
        chartList.map(chart => {
            api[`get${chart}`](startDate, endDate, desk, productionOffice)
                .then(chartData => updateAttemptActions(chartData, chart, startDate, endDate, dispatch))
                .catch(error => responseFailActions(chart, error, dispatch));
        });
    };
};

export const fetchCommissioningDesks = () => {
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

export const toggleStackChart = (isStacked) => ({
    type: 'TOGGLE_STACK_CHART',
    isStacked
});

const actions = { filterDesk, fetchCommissioningDesks, toggleStackChart };

export default actions;