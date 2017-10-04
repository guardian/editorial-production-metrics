import { createYTotalsList, createPartialsList, formattedSeries, compareDates, compareIssueDates, fillMissingDates } from 'helpers/chartsHelpers';
import moment from 'moment';

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
    const { type, chartData, startDate, endDate, error, isStacked } = action;
    switch (type) {
    case 'UPDATE_COMPOSER_VS_INCOPY': {
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
    }
    case 'GET_COMPOSER_VS_INCOPY_FAILED':
        return Object.assign({}, state, { composerVsInCopy: { ...state.composerVsInCopy, error }});

    case 'TOGGLE_STACK_CHART':
        return Object.assign({}, state, { composerVsInCopy: { ...state.composerVsInCopy, isStacked }});

    case 'UPDATE_IN_WORKFLOW_VS_NOT_IN_WORKFLOW': {
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
                    absolute: seriesWithLabels,
                    percent: percentSeries
                },
                isStacked: state.inWorkflowVsNotInWorkflow.isStacked
            }
        };  
    }
    case 'GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED':
        return Object.assign({}, state, { inWorkflowVsNotInWorkflow: { ...state.inWorkflowVsNotInWorkflow, error }});
        
    case 'UPDATE_FORK_TIME': {
        const forkTimeData = chartData.data.sort(compareIssueDates);
        const forkTimeSeries = [{ data: forkTimeData }];
        const seriesWithLabels = forkTimeSeries.map(series => {
            return {
                data: series.data.map((dataPoint) => {
                    const date = moment(dataPoint['issueDate']).utc();
                    return {
                        x: date.valueOf(),
                        y: dataPoint.secondsUntilFork,
                        label: `${(dataPoint.secondsUntilFork / 3600).toFixed(1)} hours`,
                        size: 2.5
                    };
                })
            };
        });
        return {
            ...state,
            forkTime: {
                data: {
                    absolute: seriesWithLabels
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