// Creates a list of all y values from the x,y value pairs in a series' dataset
const createPartialsList = (series) => {
    let partialsList = new Array(series.length);
    for(let i = 0; i < series.length; i++) {
        partialsList[i] = series[i].data.map(pair => pair['y']);
    }
    return partialsList;
};

// Sums the corresponding y values in the datasets of a series, to get the stacked y totals
const yTotals = (partialsList) => {
    let totals = new Array(partialsList[0].length).fill(0);
    for(let i = 0; i < partialsList.length; i++) {
        for(let j = 0; j < totals.length; j++) {
            totals[j] += partialsList[i][j];
        }
    }
    return totals;
};

const converToPercentage = (value, total) => value * 100 / total;

// Converts the y value in a data pair to its percentage value (using the y totals value)
const percentageDataSetPair = (pair, total) => { 
    return {'x': pair['x'], 'y': converToPercentage(pair['y'], total)};
};

// Converts the whole dataset y values to percentage, using the y totals collection
const percentageDataSet = (dataSet, yTotals) => {
    return dataSet.map((pair, index) => percentageDataSetPair(pair, yTotals[index]));
};

// Converts all datasets y values in a series to their percentage value
const formattedSeries = (series, yTotals) => series.map((singleSeries) => { return { data: percentageDataSet(singleSeries.data, yTotals)};});

export { createPartialsList, formattedSeries, yTotals };