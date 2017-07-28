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

// const createPartialsList = (series) => {
//     let partialsList = new Array(series.length);
//     for(let i = 0; i < series.length; i++) {
//         partialsList[i] = series[i].data.map(pair => pair['y']);
//     }
//     return partialsList;
// };

// const summedPartials = (partialsList) => {
//     let totals = new Array(partialsList[0].length).fill(0);
//     for(let i = 0; i < partialsList.length; i++) {
//         for(let j = 0; j < totals.length; j++) {
//             totals[j] += partialsList[i][j];
//         }
//     }
//     return totals;
// };

// const converToPercentage = (value, total) => value * 100 / total;

// const percentageDataSetPair = (pair, total) => { 
//     return {'x': pair['x'], 'y': converToPercentage(pair['y'], total)};
// };

// const percentageDataSet = (dataSet, summedPartials) => {
//     dataSet.map((pair, index) => percentageDataSetPair(pair, summedPartials[index]));
// };

// const formattedSeries = (series, summedPartials) => series.map(dataSet => percentageDataSet(dataSet, summedPartials));

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
    case 'UPDATE_CHARTS':
        return action.chartsData;
    default:
        return state;
    }
}
