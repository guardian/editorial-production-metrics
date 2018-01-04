import moment from 'moment';

const yesterday = moment().utc().startOf('day').subtract(1, 'd');

const initialState = {
    desk: 'tracking/commissioningdesk/all',
    newspaperBook: 'theguardian/main', // TODO: set this programatically
    productionOffice: 'all',
    startDate: yesterday.clone().startOf('day').subtract(7,'d'),
    endDate: yesterday.clone().endOf('day')
};

const filterVals = (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_FILTER':
        return Object.assign({}, state, action.filterObj);
    default:
        return state;
    }
};

export default filterVals;
