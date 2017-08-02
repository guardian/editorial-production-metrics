import { combineReducers } from 'redux';
import configureStore from './configureStore';

import chartsRedux from './chartsRedux';
import updateFilterRedux from './updateFilterRedux';
import updateProgressRedux from './updateProgressRedux';

export default () => {
    /* ------------- Assemble The Reducers ------------- */
    const rootReducer = combineReducers({
        filterVals: updateFilterRedux,
        charts: chartsRedux,
        isUpdating: updateProgressRedux
    });

    return configureStore(rootReducer);
};
