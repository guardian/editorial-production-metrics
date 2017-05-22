const initialState = {
    office: 'all',
    desk: 'all',
    section: 'all',
    time: '7days'
};

export default function graphData(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_FILTER':
            return Object.assign({}, state, action.filterObj);
        default:
            return state;
    }
}
