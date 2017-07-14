import { combineReducers } from 'redux';
import chartReducer from './chartReducer';
import updateFilterReducer from './updateFilterReducer';
import updateProgressReducer from './updateProgressReducer';

const rootReducer = combineReducers({
    filterVals: updateFilterReducer,
    charts: chartReducer,
    updatingBool: updateProgressReducer
});

export default rootReducer;
