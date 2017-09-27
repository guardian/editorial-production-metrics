import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import configureStore from './configureStore';
import charts from 'reducers/chartsReducer';
import filterVals from 'reducers/updateFilterReducer';
import isUpdating from 'reducers/updateProgressReducer';
import commissioningDesks from 'reducers/commissioningDesksReducer';

export default () => {
    /* ------------- Assemble The Reducers ------------- */
    const rootReducer = combineReducers({
        filterVals,
        charts,
        isUpdating,
        commissioningDesks,
        routing 
    });

    return configureStore(rootReducer);
};