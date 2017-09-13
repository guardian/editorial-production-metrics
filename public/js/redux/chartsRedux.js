import { State, Actions, Effect } from 'jumpstate';
import api from 'services/Api';
import chartList from 'utils/chartList';
import { createYTotalsList, createPartialsList, formattedSeries, compareDates, fillMissingDates } from 'helpers/chartsHelpers';
import { reEstablishSession } from 'panda-session';
import moment from 'moment';

/* ------------- State Management ------------- */

const updateAttemptActions = (chartData, chart, startDate, endDate) => {
    Actions.toggleIsUpdatingCharts(false);
    Actions[`update${chart}`]({ chartData, startDate, endDate });
};

const responseFailActions = (chart, error) => {
    Actions.toggleIsUpdatingCharts(false);
    Actions[`get${chart}Failed`](error);
};

Effect('filterDesk', (filterObj) => {
    Actions.updateFilter(filterObj);
    Actions.toggleIsUpdatingCharts(true);
    const { startDate, endDate, desk, productionOffice } = filterObj;
    chartList.map(chart => {
        api[`get${chart}`](startDate, endDate, desk, productionOffice)
            .then(chartData => updateAttemptActions(chartData, chart, startDate, endDate))
            .catch(error => {
                const status = error.response.status;
                if (status === 419) {
                    reEstablishSession('/reauth', 5000)
                        .then(
                            () => {
                                api[`get${chart}`](startDate, endDate, desk, productionOffice)
                                    .then(chartData => updateAttemptActions(chartData, chart, startDate, endDate));
                            },
                            error => responseFailActions(chart, error)
                        );
                } else {
                    responseFailActions(chart, error);
                }
            });
    });
});

const chartsRedux = State({
    initial: {
        composerVsInCopy: {
            data: {
                absolute: [],
                percent: []
            },
            isStacked: true
        },
        inWorkflowVsNotInWorkflow: {
            data: {
                percent: []
            },
            isStacked: true
        }
    },

    updateComposerVsIncopy(state, { chartData, startDate, endDate }) {
        const { composerResponse, inCopyResponse } = chartData;
        const range = endDate.diff(startDate, 'days');
        const composerData = composerResponse.data.length <= range ?  fillMissingDates(startDate, endDate, composerResponse.data).sort(compareDates) : composerResponse.data.sort(compareDates);
        const inCopyData = inCopyResponse.data.length <= range ?  fillMissingDates(startDate, endDate, inCopyResponse.data).sort(compareDates) : inCopyResponse.data.sort(compareDates);
        const composerVsInCopyData = [{ data: composerData }, { data: inCopyData }];

        const seriesWithLabels = composerVsInCopyData.map(series => {
            return {
                data: series.data.map((dataPoint, index) => {
                    const date = moment(dataPoint['date']).utc();
                    return {
                        x: date.valueOf(),
                        y: dataPoint['count'],
                        label: `Date: ${date.format('ddd, Do MMMM YYYY')}\nCreated in Composer: ${composerVsInCopyData[0]['data'][index]['count']}\nCreated in InCopy: ${composerVsInCopyData[1]['data'][index]['count']}`
                    };
                })
            };
        });
        const totals = createYTotalsList(createPartialsList(seriesWithLabels));
        const percentSeries = formattedSeries(seriesWithLabels, totals);

        return {
            ...state,
            composerVsInCopy: {
                data: {
                    absolute: seriesWithLabels,
                    percent: percentSeries
                },
                isStacked: state.composerVsInCopy.isStacked
            }
        };
    },

    toggleStackChart(state, isStacked) {
        return {
            ...state,
            composerVsInCopy: {
                ...state.composerVsInCopy,
                isStacked
            }
        };
    },

    getComposerVsIncopyFailed(state, error) {
        return {
            ...state,
            composerVsInCopy: {
                ...state.composerVsInCopy,
                error: error.message
            }
        };
    },

    updateInWorkflowVsNotInWorkflow(state, { chartData, startDate, endDate }) {
        const { inWorkflowResponse, notInWorkflowResponse } = chartData;
        const range = endDate.diff(startDate, 'days');
        const inWorkflowData = inWorkflowResponse.data.length <= range ?  fillMissingDates(startDate, endDate, inWorkflowResponse.data).sort(compareDates) : inWorkflowResponse.data.sort(compareDates);
        const notInWorkflowData = notInWorkflowResponse.data.length <= range ?  fillMissingDates(startDate, endDate, notInWorkflowResponse.data).sort(compareDates) : notInWorkflowResponse.data.sort(compareDates);
        const workflowVsNotInWorkflowData = [{ data: inWorkflowData }, { data: notInWorkflowData }];

        const seriesWithLabels = workflowVsNotInWorkflowData.map(series => {
            return {
                data: series.data.map((dataPoint, index) => {
                    const date = moment(dataPoint['date']).utc();
                    return {
                        x: date.valueOf(),
                        y: dataPoint['count'],
                        label: `Date: ${date.format('ddd, Do MMMM YYYY')}\nIn Workflow: ${workflowVsNotInWorkflowData[0]['data'][index]['count']}\nNever in Workflow: ${workflowVsNotInWorkflowData[1]['data'][index]['count']}`
                    };
                })
            };
        });
        const totals = createYTotalsList(createPartialsList(seriesWithLabels));
        const percentSeries = formattedSeries(seriesWithLabels, totals);

        return {
            ...state,
            inWorkflowVsNotInWorkflow: {
                data: {
                    percent: percentSeries
                },
                isStacked: state.inWorkflowVsNotInWorkflow.isStacked
            }
        };  
    },

    getInWorkflowVsNotInWorkflowFailed(state, error) {
        return {
            ...state,
            inWorkflowVsNotInWorkflow: {
                ...state.inWorkflowVsNotInWorkflow,
                error: error.message
            }
        };
    }
});

export default chartsRedux;
