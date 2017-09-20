import moment from 'moment';

const initialState = {
    desk: 'tracking/commissioningdesk/all',
    productionOffice: 'all',
    startDate: moment().utc().startOf('day').subtract(7,'d'),
    endDate: moment().utc().endOf('day')
};


const updateFilterReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_FILTER':
        return action.filterObj;
    default:
        return state;
    }
};

export default updateFilterReducer;