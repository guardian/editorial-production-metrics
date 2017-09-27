export const updateFilter = (filterObj) => ({
    type: 'UPDATE_FILTER',
    filterObj
});

export const updateCommissioningDesks = (desksList) => ({
    type: 'UPDATE_COMMISSIONING_DESKS',
    desksList
});

export const getCommissioningDesksFailed = (error) => ({
    type: 'GET_COMMISSIONING_DESKS_FAILED',
    error
});
