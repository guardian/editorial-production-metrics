import moment from 'moment';
import {
  createYTotalsList,
  createPartialsList,
  formattedSeries,
  compareDates,
  compareIssueDates,
  fillMissingDates
} from "helpers/chartsHelpers";


export const updateComposerVsIncopy = ({ chartData, startDate, endDate }) => {
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
        type: 'UPDATE_COMPOSER_VS_INCOPY',
        absolute: seriesWithLabels,
        percent: percentSeries
    };
};

export const getComposerVsIncopyFailed = (error) => ({
    type: 'GET_COMPOSER_VS_INCOPY_FAILED',
    error
});

export const updateInWorkflowVsNotInWorkflow = ({ chartData, startDate, endDate }) => {
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
        type: 'UPDATE_IN_WORKFLOW_VS_NOT_IN_WORKFLOW',
        absolute: seriesWithLabels,
        percent: percentSeries
    };
};

export const getInWorkflowVsNotInWorkflowFailed = (error) => ({
    type: 'GET_IN_WORKFLOW_VS_NOT_IN_WORKFLOW_FAILED',
    error
});

export const updateForkTime = ({ chartData, startDate, endDate }) => {

    const forkTimeData = chartData.data.sort(compareIssueDates);
    const forkTimeSeries = [{ data: forkTimeData }];
    const seriesWithLabels = forkTimeSeries.map(series => {
        return {
            data: series.data.map((dataPoint) => {
                const date = moment(dataPoint['issueDate']).utc();
                const hours = dataPoint.timeToPublication / 3600 / 1000;
                return {
                    x: date.valueOf(),
                    y: hours,
                    label: `${hours.toFixed(1)} hours`,
                    size: 2.5
                };
            })
        };
    });

    return {
        type: 'UPDATE_FORK_TIME',
        absolute: seriesWithLabels
    };
};

export const getForkTimeFailed = (error) => ({
    type: 'GET_FORK_TIME_FAILED',
    error
});