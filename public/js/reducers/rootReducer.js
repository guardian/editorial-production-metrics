import {combineReducers} from 'redux';
import chartStartedInComposerReducer from './chartStartedInComposerReducer';
import chartNeverInWorkflowReducer from './chartNeverInWorkflowReducer';

const rootReducer = combineReducers({
    startedInComposer: chartStartedInComposerReducer,
    neverInWorkflow: chartNeverInWorkflowReducer
});

export default rootReducer;
