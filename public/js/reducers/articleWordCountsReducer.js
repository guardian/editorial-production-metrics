// TODO: remove this mock data
import {
    wordCountBands,
    commissionedLengthBands,
    articles
} from "../components/Tabs/_commissionedLengthTestData";

const initialState = {
    // This data comes from the server as in some extreme cases we may not
    // return all the articles for a large date range but will return the stats
    // for all articles in that range
    /*
    bands currently have the shape:
    {
        label: string,
        count: number,
    }
    */
    aggregates: {
        wordCountBands,
        commissionedLengthBands,
    },
    /*
    articles currently have the shape:
    {
        path: string,
        headline: string,
        wordCount: number,
        commissionedLength: number,
    }
    */
    articles,
    // This flag from the server will allow us to show if we capped the amount
    // of returned articles
    articlesOmitted: false
};

const articleWordCounts = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_WORD_COUNT_ARTICLES":
            return {
                ...state,
                // articles keyed by id
                articles: {
                    ...state.articles,
                    ...action.payload.articles
                }
            };
            break;
    
        case "UPDATE_WORD_COUNT_AGGREGATES":
            return {
                ...state,
                aggregates: {
                    ...state.aggregates,
                    ...action.payload.aggregates
                }
            };
            break;
        default:
            return state;
    }
};

export default articleWordCounts;
