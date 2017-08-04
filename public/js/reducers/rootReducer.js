import { combineReducers } from 'redux';
import chartsReducer from './chartsReducer';
import updateFilterReducer from './updateFilterReducer';
import updateProgressReducer from './updateProgressReducer';

const rootReducer = combineReducers({
    filterVals: updateFilterReducer,
    charts: chartsReducer,
    isUpdating: updateProgressReducer
});

export default rootReducer;
