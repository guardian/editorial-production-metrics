const initialState = {
    office: 'all',
    desk: 'all',
    section: 'all'
};

export default function graphData(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_FILTER':
            return Object.assign({}, state, action.filterObj);
        default:
            return state;
    }
}
