const initialState = {
    booksList: ['all']
};

const newspaperBooks = (state = initialState, action) => {
    const { booksList, error, type } = action;
    switch (type) {
    case 'UPDATE_NEWSPAPER_BOOKS':
        return {
            ...state,
            booksList
        };
    case 'GET_NEWSPAPER_BOOKS_FAILED':
        return {
            ...state,
            error
        };
    default:
        return state;
    }
};

export default newspaperBooks;