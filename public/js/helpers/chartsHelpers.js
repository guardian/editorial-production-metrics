import moment from 'moment';

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

const convertToPercentage = (value, total) => value * 100 / total;

const formatDate = date => moment(date).valueOf();

// Converts the y value in a data pair to its percentage value (using the y totals value) and the x value to its milliseconds date value
const formatDatasetPair = (pair, total) => { 
    return {'x': formatDate(pair['x']), 'y': convertToPercentage(pair['y'], total)};
};

// Converts the whole dataset y values to percentage, using the y totals collection
const percentageDataSet = (dataSet, yTotalsList) => {
    return dataSet.map((pair, index) => formatDatasetPair(pair, yTotalsList[index]));
};

// Converts all datasets y values in a series to their percentage value
const formattedSeries = (series, yTotalsList) => series.map((singleSeries) => { return { data: percentageDataSet(singleSeries.data, yTotalsList)};});

export { createPartialsList, formattedSeries, createYTotalsList };