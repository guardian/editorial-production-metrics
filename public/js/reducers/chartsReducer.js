const startVals = [{
    data: [
        {x: 1, y: 5},
        {x: 2, y: 5},
        {x: 3, y: 5},
        {x: 4, y: 5},
        {x: 5, y: 5},
        {x: 6, y: 5},
        {x: 7, y: 5}
    ]
}];

const startAreaVals = [
    {
        data: [
            {x: 1, y: 0},
            {x: 2, y: 0},
            {x: 3, y: 0},
            {x: 4, y: 0},
            {x: 5, y: 0},
            {x: 6, y: 0},
            {x: 7, y: 0}
        ]
    }, {
        data: [
            {x: 1, y: 100},
            {x: 2, y: 100},
            {x: 3, y: 100},
            {x: 4, y: 100},
            {x: 5, y: 100},
            {x: 6, y: 100},
            {x: 7, y: 100}
        ]
    }
];

// Creates a list of all y values from the x,y value pairs in a series' dataset

const createPartialsList = (series) => {
    let partialsList = new Array(series.length);
    for(let i = 0; i < series.length; i++) {
        partialsList[i] = series[i].data.map(pair => pair['y']);
    }
    return partialsList;
};

// Sums the corresponding y values in the datasets of a series, to get the stacked y totals

const summedPartials = (partialsList) => {
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

const percentageDataSet = (dataSet, summedPartials) => {
    return dataSet.map((pair, index) => percentageDataSetPair(pair, summedPartials[index]));
};

// Converts all datasets y values in a series to their percentage value

const formattedSeries = (series, summedPartials) => series.map((singleSeries) => { return { data: percentageDataSet(singleSeries.data, summedPartials)};});

const initialState = {
    startedInComposer: startVals,
    neverInWorkflow: startVals,
    paperStartedInDigital: startVals,
    digitalStartedInInCopy: startVals,
    printOnly: startVals,
    composerVsInCopy: startAreaVals
};

export default function chartsReducer(state = initialState, action) {
    switch (action.type) {
    case 'UPDATE_COMPOSER_VS_INCOPY_CHARTS': {
        const series = action.chartsData.composerVsInCopy;
        const totals = summedPartials(createPartialsList(series));
        const percentSeries = formattedSeries(series, totals);
        return Object.assign({}, state, { composerVsInCopy: percentSeries });
    }
    default:
        return state;
    }
}