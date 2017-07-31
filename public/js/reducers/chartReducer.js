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

const startAreaVals = [{
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
    }];

const initialState = {
    startedInComposer: startVals,
    neverInWorkflow: startVals,
    paperStartedInDigital: startVals,
    digitalStartedInInCopy: startVals,
    printOnly: startVals,
    composerVsInCopy: startAreaVals
};

export default function chartReducer(state = initialState, action) {
    switch (action.type) {
    case 'UPDATE_CHARTS':
        return action.dataPoints;
    default:
        return state;
    }
}
