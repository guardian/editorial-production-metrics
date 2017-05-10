const initialState = [
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
    }
];

export default function graphData(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_CHART':
            return [action.dataPoints];
        default:
            return state;
    }
}
