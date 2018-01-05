import moment from 'moment';

const getYesterday = () => { return moment().utc().startOf('day').subtract(1, 'd')};

const values = {
    desk: 'tracking/commissioningdesk/all',
    newspaperBook: 'theguardian/mainsection', // TODO: set this programatically
    productionOffice: 'all',
    startDate: getYesterday().startOf('day').subtract(7,'d').format(),
    endDate: getYesterday().endOf('day').format()
};

const activateAll = filters =>
    filters.reduce((out, filter) => ({
    ...out,
    [filter]: "visible"
}), {});

const initialState = {
    values,
    statuses: activateAll(Object.keys(values)),
};

const filterVals = (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_FILTER':
        return {
            ...state,
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
