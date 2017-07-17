import moment from 'moment';

const initialState = {
    office: 'all',
    desk: 'all',
    section: 'all',
    startDate: moment().subtract(7,'d'),
    endDate: moment()
};

export default function graphData(state = initialState, action) {
    switch (action.type) {       
    case 'UPDATE_FILTER':
        return Object.assign({}, state, action.filterObj);
    default:
        return state;
    }
}
