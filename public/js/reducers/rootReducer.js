import {combineReducers} from 'redux';
import chartReducer from './chartReducer';
import updateFilterReducer from './updateFilterReducer';

const rootReducer = combineReducers({
    filterVals: updateFilterReducer,
    charts: chartReducer
});

export default rootReducer;
