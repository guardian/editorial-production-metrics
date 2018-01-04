import moment from 'moment';

const getYesterday = () => { return moment().utc().startOf('day').subtract(1, 'd')};

const initialState = {
    desk: 'tracking/commissioningdesk/all',
    newspaperBook: 'theguardian/mainsection', // TODO: set this programatically
    productionOffice: 'all',
    startDate: getYesterday().startOf('day').subtract(7,'d').format(),
    endDate: getYesterday().endOf('day').format()
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
