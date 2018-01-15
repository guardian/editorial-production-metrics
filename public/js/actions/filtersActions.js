export const updateFilter = (values) => ({
    type: 'UPDATE_FILTER',
    values
});

export const updateCommissioningDesks = (desksList) => ({
    type: 'UPDATE_COMMISSIONING_DESKS',
    desksList
});

export const getCommissioningDesksFailed = (error) => ({
    type: 'GET_COMMISSIONING_DESKS_FAILED',
    error
});

export const updateNewspaperBooks = (booksList) => ({
    type: 'UPDATE_NEWSPAPER_BOOKS',
    booksList
});

export const getNewspaperBooksFailed = (error) => ({
    type: 'GET_NEWSPAPER_BOOKS_FAILED',
    error
});
