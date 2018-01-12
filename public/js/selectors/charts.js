import moment from "moment";
import {
    compareIssueDates,
    getComparisonTimeSeriesFromResponses
} from "../helpers/chartsHelpers";
import { createSelector } from "reselect";
import { bandName } from "../utils/BandUtils";

const getCharts = ({ charts }) => charts;

const getMoments = ({ startDate, endDate }) => ({
    startDate: moment(startDate),
    endDate: moment(endDate)
});

/* Composer vs Incopy */

export const getRawComposerVsIncopy = createSelector(
    getCharts,
    ({ composerVsInCopy }) => composerVsInCopy
);

export const getComposerVsIncopyData = createSelector(
    getRawComposerVsIncopy,
    composerVsInCopy => {
        const {
            chartData: { composerResponse, inCopyResponse },
            pending
        } = composerVsInCopy;

        if (pending) {
            return {
                absolute: [],
                percent: []
            };
        }

        const { startDate, endDate } = getMoments(composerVsInCopy);

        return getComparisonTimeSeriesFromResponses(
            composerResponse,
            inCopyResponse,
            startDate,
            endDate,
            "Created in Composer",
            "Created in InCopy"
        );
    }
);

export const getComposerVsIncopy = createSelector(
    getRawComposerVsIncopy,
    getComposerVsIncopyData,
    ({ error, isStacked }, data) => ({
        data,
        error,
        isStacked
    })
);

/* In Workflow vs not in Workflow */

const getRawInWorkflowVsNotInWorkflow = createSelector(
    getCharts,
    ({ inWorkflowVsNotInWorkflow }) => inWorkflowVsNotInWorkflow
);

const getInWorkflowVsNotInWorkflowData = createSelector(
    getRawInWorkflowVsNotInWorkflow,
    inWorkflowVsNotInWorkflow => {
        const {
            chartData: { inWorkflowResponse, notInWorkflowResponse },
            pending,
        } = inWorkflowVsNotInWorkflow;
    
        if (pending) {
            return {
                absolute: [],
                percent: []
            };
        }

        const { startDate, endDate } = getMoments(inWorkflowVsNotInWorkflow);
    
        return getComparisonTimeSeriesFromResponses(
            inWorkflowResponse,
            notInWorkflowResponse,
            startDate,
            endDate,
            "In Workflow",
            "Never in Workflow"
        );
    }
);

export const getInWorkflowVsNotInWorkflow = createSelector(
    getRawInWorkflowVsNotInWorkflow,
    getInWorkflowVsNotInWorkflowData,
    ({ error, isStacked }, data) => ({
        data,
        error,
        isStacked
    })
);

/* Fork Time */

const createForkTimeData = chart => {
    const { chartData, pending } = chart;
    if (pending) {
        return {
            absolute: []
        };
    }

    const forkTimeData = chartData.data.sort(compareIssueDates);
    const forkTimeSeries = [{ data: forkTimeData }];
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

const responseToBands = data => data.map(({ countRange: [min, max], count }) => ({
    label: bandName(min, max),
    count
}));

/* Word Count */

const getWordCountData = createSelector(
    getCharts,
    ({ wordCount: { pending, chartData: { data } } }) => pending ? [] : data
);

export const getWordCountBands = createSelector(
    getWordCountData,
    responseToBands
);

/* Commissioned Length */

const getCommissionedLengthData = createSelector(
    getCharts,
    ({ commissionedLength: { pending, chartData: { data } } }) =>
        pending ? [] : data
);

const sumCounts = arr => arr.reduce((sum, { count }) => sum + count, 0);

const getArticleCount = createSelector(
    getWordCountData,
    data => sumCounts(data)
);

export const getWithCommissionedLengthCount = createSelector(
    getCommissionedLengthData,
    data => sumCounts(data)
);

export const getWithoutCommissionedLengthCount = createSelector(
    getArticleCount,
    getWithCommissionedLengthCount,
    (articleCount, commissionedLengthCount) =>
        articleCount - commissionedLengthCount
);

export const getCommissionedLengthBands = createSelector(
    getCommissionedLengthData,
    getWithoutCommissionedLengthCount,
    (data, count) => responseToBands(data).concat({
        label: "None",
        count, 
    })
);
