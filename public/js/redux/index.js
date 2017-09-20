import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import configureStore from './configureStore';
import chartsReducer from 'reducers/chartsReducer';
import updateFilterReducer from 'reducers/updateFilterReducer';
import updateProgressReducer from 'reducers/updateProgressReducer';
import commissioningDesksReducer from 'reducers/commissioningDesksReducer';

export default () => {
    /* ------------- Assemble The Reducers ------------- */
    const rootReducer = combineReducers({
        filterVals: updateFilterReducer,
        charts: chartsReducer,
        isUpdating: updateProgressReducer,
        commissioningDesks: commissioningDesksReducer,
        routing: routerReducer 
    });

    return configureStore(rootReducer);
};