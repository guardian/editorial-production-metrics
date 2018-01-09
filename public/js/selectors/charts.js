import moment from "moment";
import {
    createYTotalsList,
    createPartialsList,
    formattedSeries,
    compareDates,
    compareIssueDates,
    fillMissingDates
} from "../helpers/chartsHelpers";

const getCharts = ({ charts }) => charts;
const getMoments = ({ startDate, endDate }) => ({
    startDate: moment(startDate),
    endDate: moment(endDate)
});

const createComposerVsIncopyData = chart => {
    const {
        chartData: { composerResponse, inCopyResponse },
        pending
    } = chart;

    if (pending) {
        return {
            absolute: [],
            percent: []
        };
    }

    const { startDate, endDate } = getMoments(chart);

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
        absolute: seriesWithLabels,
        percent: percentSeries
    };
};

// memoize me
export const getComposerVsIncopy = state => {
    const { composerVsInCopy } = getCharts(state);
    const {
        error,
        isStacked
    } = composerVsInCopy;

    return {
        data: createComposerVsIncopyData(composerVsInCopy),
        error,
        isStacked
    };
};

const createInWorkflowVsNotInWorkflowData = chart => {
    const {
        chartData: { inWorkflowResponse, notInWorkflowResponse },
        pending,
    } = chart;

    if (pending) {
        return {
            absolute: [],
            percent: []
        };
    }

    const { startDate, endDate } = getMoments(chart);

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
        absolute: seriesWithLabels,
        percent: percentSeries
    };
};

export const getInWorkflowVsNotInWorkflow = state => {
    const { inWorkflowVsNotInWorkflow } = getCharts(state);
    const { error, isStacked } = inWorkflowVsNotInWorkflow;

    return {
        data: createInWorkflowVsNotInWorkflowData(inWorkflowVsNotInWorkflow),
        error,
        isStacked
    };
};

const createForkTimeData = chart => {
    const { chartData, pending } = chart;
    if (pending) {
        return {
            absolute: []
        };
    }

    const { startDate, endDate } = getMoments(chart);

    const forkTimeData = chartData.data.sort(compareIssueDates);
    const forkTimeSeries = [{ data: forkTimeData }];
    console.log(forkTimeSeries);
    return {
        absolute: forkTimeSeries.map(series => ({
            data: series.data.map((dataPoint) => {
                const date = moment(dataPoint['issueDate']).utc();
                const hours = dataPoint.timeToPublication / 3600 / 1000;
                return {
                    x: date,
                    y: hours,
                    label: `${hours.toFixed(1)} hours`,
                    size: 2.5
                };
            })
        }))
    };
};

export const getForkTime = state => {
    const { forkTime } = getCharts(state);
    const { isStacked, error } = forkTime;

    return {
        data: createForkTimeData(forkTime),
        error,
        isStacked
    };
};
