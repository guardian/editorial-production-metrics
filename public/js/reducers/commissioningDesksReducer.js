const initialState = {
    desksList: ['tracking/commissioningdesk/all']
};

const commissioningDesks = (state = initialState, action) => {
    const { desksList, error, type } = action;
    switch (type) {
    case 'UPDATE_COMMISSIONING_DESKS':
        return {
            ...state,
            desksList
        };
    case 'GET_COMMISSIONING_DESKS_FAILED':
        return {
            ...state,
            error
        };
    default:
        return state;
    }
};

export default commissioningDesks;