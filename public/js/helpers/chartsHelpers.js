import moment from 'moment';
import _merge from 'lodash/merge';
import { saveAs } from 'file-saver';
// Creates a list of all y values from the x,y value pairs in a series' dataset
const createPartialsList = (series) => {
    let partialsList = new Array(series.length);
    for(let i = 0; i < series.length; i++) {
        partialsList[i] = series[i].data.map(pair => pair['y']);
    }
    return partialsList;
};

// Sums the corresponding y values in the datasets of a series, to get the stacked y totals
const createYTotalsList = (partialsList) => {
    let totals = new Array(partialsList[0].length).fill(0);
    for(let i = 0; i < partialsList.length; i++) {
        for(let j = 0; j < totals.length; j++) {
            totals[j] += partialsList[i][j];
        }
    }
    return totals;
};

const convertToPercentage = (value, total) => total ? value * 100 / total : 0;

// Converts the y value in a data pair to its percentage value (using the y totals value)
const percentageDataSetPair = (pair, total) => { 
    return { x: pair.x, y: convertToPercentage(pair.y, total), label: pair.label };
};

// Converts the whole dataset y values to percentage, using the y totals collection
const percentageDataSet = (dataSet, yTotalsList) => {
    return dataSet.map((pair, index) => percentageDataSetPair(pair, yTotalsList[index]));
};

// Converts all datasets y values in a series to their percentage value
const formattedSeries = (series, yTotalsList) => series.map((singleSeries) => { return { data: percentageDataSet(singleSeries.data, yTotalsList)};});

// Sort by more recent date
const compareDates = (a, b) => a['date'] < b['date'] ? -1 : 1;

const compareIssueDates = (a, b) => a['issueDate'] < b['issueDate'] ? -1 : 1;

// Fill in empty datapoints with the corresponding missing date and a value of 0 for the content produced on that day
const fillMissingDates = (startDate, endDate, data) => {
    const now = startDate.utc().startOf('day').clone();

    while (now.isBefore(endDate) || now.isSame(endDate)) {
        const found = data.some(dataPoint => dataPoint['date'] === now.format());
        !found && data.push({ date: now.format(), count: 0 });
        now.add(1, 'days');
    }
    return data;
};

// Components helpers

// Remove the 'tracking/commissioningdesk/' bit from the desk identifier string, replace dashes with spaces and capitalize each word
const formatDeskName = deskName => deskName.substr(27).replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase());

const humanizeKeys = (obj, system) => ({ date: moment(obj.x).format('ddd, Do MMMM YYYY'), [`${system}`]: obj['y'] });

const humanizeSeries = (series, system) => series.map(obj => humanizeKeys(obj, system));

const unifiedSeries = (composerObject, inCopyObject) => _merge(composerObject ,inCopyObject);

const replacer = (key, value) => value === null ? '' : value;

const downloadCSV = (data, chartType, filterVals) => {
    const series = data.absolute;
    const csvSeries = (chartType => {
        switch (chartType) {
        case 'ComposerVsIncopy':
            return unifiedSeries(humanizeSeries(series[0].data, 'created_in_composer'), humanizeSeries(series[1].data, 'created_in_incopy'));
        case 'InWorkflowVsNotInWorkflow':
            return unifiedSeries(humanizeSeries(series[0].data, 'seen_in_workflow'), humanizeSeries(series[1].data, 'not_seen_in_workflow'));
        case 'ForkTime':
            return humanizeSeries(series[0].data, 'seconds_to_fork');
        }
    })(chartType);
    try {
        const header = Object.keys(csvSeries[0]);
        let csv = csvSeries.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        csv = csv.join('\r\n');
        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        const dateRangeString = `${filterVals.startDate.format('DD/MM/YYYY')}-${filterVals.endDate.format('DD/MM/YYYY')}`;
        const fileName = `${chartType}_office=${filterVals.productionOffice}_desk=${formatDeskName(filterVals.desk)}_dateRange=${dateRangeString}.csv`;
        saveAs(blob, fileName);
    } catch(e) {
        console.log(`Could not download csv due to this error: ${e.message}`);
    }
};

export { createPartialsList, formattedSeries, createYTotalsList, compareDates, compareIssueDates, fillMissingDates, downloadCSV, formatDeskName };