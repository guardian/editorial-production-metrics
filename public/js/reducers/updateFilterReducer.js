import moment from 'moment';

const initialState = {
    desk: 'tracking/commissioningdesk/all',
    newspaperBook: 'all',
    productionOffice: 'all',
    startDate: moment().utc().startOf('day').subtract(7,'d'),
    endDate: moment().utc().endOf('day')
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
