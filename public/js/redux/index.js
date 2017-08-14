import { combineReducers } from 'redux';
import configureStore from './configureStore';

import chartsRedux from './chartsRedux';
import updateFilterRedux from './updateFilterRedux';
import updateProgressRedux from './updateProgressRedux';
import commissioningDesksRedux from './commissioningDesksRedux';

export default () => {
    /* ------------- Assemble The Reducers ------------- */
    const rootReducer = combineReducers({
        filterVals: updateFilterRedux,
        charts: chartsRedux,
        isUpdating: updateProgressRedux,
        commissioningDesks: commissioningDesksRedux
    });

    return configureStore(rootReducer);
};