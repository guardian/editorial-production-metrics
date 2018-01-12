const initialState = {
    /*
    articles currently have the shape:
    {
        path: string,
        headline: string,
        wordCount: number,
        commissionedLength: number,
    }
    */
    articles: {},
};

const articleWordCounts = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_WORD_COUNT_ARTICLES":
        console.log(action.payload);
            return {
                ...state,
                // articles keyed by id
                articles: {
                    ...state.articles,
                    ...action.payload.chartData.data
                }
            };
        default:
            return state;
    }
};

export default articleWordCounts;
