import { CHART_LIST, CHART_ARGS_MAP } from 'utils/chartList';
import {
    updateComposerVsIncopy, 
    getComposerVsIncopyFailed, 
    updateInWorkflowVsNotInWorkflow,
    getInWorkflowVsNotInWorkflowFailed,
    updateForkTime,
    getForkTimeFailed

} from './chartsActions';
import { toggleIsUpdatingCharts } from './uiActions';
import {
  updateFilter,
  updateCommissioningDesks,
  getCommissioningDesksFailed,
  updateNewspaperBooks,
  getNewspaperBooksFailed
} from "./filtersActions";
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

const filtersToArgs = (chart, filterObj) =>
    CHART_ARGS_MAP[chart].map(filter => filterObj[filter]);

export const filterDesk = (filterObj = {}) => {
    return (dispatch) => {
        dispatch(updateFilter(filterObj));
        dispatch(toggleIsUpdatingCharts(true));
        const { startDate, endDate } = filterObj;
        CHART_LIST.map(chart => {
            api[`get${chart}`](...filtersToArgs(chart, filterObj))
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

export const fetchNewspaperBooks = () => {
    return (dispatch) => {
        api.getNewspaperBooks()
            .then(response => {
                const booksList = response.data;
                booksList.push('all');
                dispatch(updateNewspaperBooks(booksList));
            })
            .catch(dispatch(getNewspaperBooksFailed));
    };
};

export const toggleStackChart = (isStacked) => ({
    type: 'TOGGLE_STACK_CHART',
    isStacked
});

const actions = { filterDesk, fetchCommissioningDesks, fetchNewspaperBooks, toggleStackChart };

export default actions;