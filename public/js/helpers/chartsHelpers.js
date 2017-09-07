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

// Fill in empty datapoints with the corresponding missing date and a value of 0 for the content produced on that day
const fillMissingDates = (startDate, endDate, data) => {
    // THIS .add(1, 'hour') bit is a TEMPORARY fix, as the response from the api has changed from 00:00:00 to 01:00:00. This will be reverted once the response has been corrected.
    const now = startDate.utc().startOf('day').add(1, 'hour').clone();

    while (now.isBefore(endDate) || now.isSame(endDate)) {
        const found = data.some(dataPoint => dataPoint['date'] === now.format());
        !found && data.push({ date: now.format(), count: 0 });
        now.add(1, 'days');
    }
    return data;
};

export { createPartialsList, formattedSeries, createYTotalsList, compareDates, fillMissingDates };