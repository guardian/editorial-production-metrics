import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import configureStore from './configureStore';
import charts from 'reducers/chartsReducer';
import filters from 'reducers/filtersReducer';
import isUpdating from 'reducers/updateProgressReducer';
import commissioningDesks from 'reducers/commissioningDesksReducer';
import newspaperBooks from 'reducers/newspaperBooksReducer';
import articleWordCounts from 'reducers/articleWordCountsReducer';

export default () => {
    /* ------------- Assemble The Reducers ------------- */
    const rootReducer = combineReducers({
        filters,
        charts,
        isUpdating,
        commissioningDesks,
        newspaperBooks,
        routing,
        articleWordCounts
    });

    return configureStore(rootReducer);
};