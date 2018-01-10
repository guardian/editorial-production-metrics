import moment from "moment";
import {
    compareIssueDates,
    getComparisonTimeSeriesFromResponses
} from "../helpers/chartsHelpers";
import { createSelector } from "reselect";

const getCharts = ({ charts }) => charts;

const getMoments = ({ startDate, endDate }) => ({
    startDate: moment(startDate),
    endDate: moment(endDate)
});

/* Composer vs Incopy */

const getRawComposerVsIncopy = createSelector(
    getCharts,
    ({ composerVsInCopy }) => composerVsInCopy
);

const getComposerVsIncopyData = createSelector(
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
            "Created in composer",
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
