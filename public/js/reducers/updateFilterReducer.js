import moment from 'moment';

const yesterday = moment().utc().subtract(1, 'd');

const initialState = {
    desk: 'tracking/commissioningdesk/all',
    productionOffice: 'all',
    startDate: yesterday.startOf('day').subtract(7,'d'),
    endDate: yesterday.endOf('day')
};


const filterVals = (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_FILTER':
        return Object.assign({}, state, filterVals);
    default:
        return state;
    }
};

export default filterVals;