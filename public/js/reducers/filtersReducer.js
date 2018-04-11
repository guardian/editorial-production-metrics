import moment from 'moment';

const getYesterday = () => { return moment().utc().startOf('day').subtract(1, 'd')};

const values = {
    desk: 'tracking/commissioningdesk/all',
    newspaperBook: 'theguardian/mainsection', // TODO: set this programatically
    productionOffice: 'all',
    startDate: getYesterday().startOf('day').subtract(7,'d').format(),
    endDate: getYesterday().endOf('day').format(),
    //This is set by default to 24 hours (86400000 milliseconds)
    maxForkTimeInMilliseconds: 86400000
};

const activateAll = filters =>
    filters.reduce((out, filter) => ({
    ...out,
    [filter]: "visible"
}), {});

const initialState = {
    values,
    statuses: activateAll(Object.keys(values)),
    loaded: false
};

const filterVals = (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_FILTER':
        return {
            ...state,
            loaded: true,
            values: {
                ...state.values,
                ...action.values
            }
        }; 
    case 'UPDATE_FILTER_STATUSES':
        return {
            ...state,
            statuses: {
                ...activateAll(Object.keys(state.values)),
                ...action.statuses
            }
        }; 
    default:
        return state;
    }
};

export default filterVals;
