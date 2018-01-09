import { connect } from "react-redux";
import {
    getComposerVsIncopy,
    getInWorkflowVsNotInWorkflow
    
} from "../selectors/charts";
import { getFilterVals, getIsUpdating } from "../selectors";
import { toggleStackChart } from "../actions";
import Origin from "../components/Tabs/Origin";

const mapStateToProps = state => ({
    charts: {
        composerVsInCopy: getComposerVsIncopy(state),
        inWorkflowVsNotInWorkflow: getInWorkflowVsNotInWorkflow(state)
    },
    filterVals: getFilterVals(state),
    isUpdating: getIsUpdating(state)
});

const mapDispatchToProps = dispatch => ({
    toggleStackChart: (...args) => dispatch(toggleStackChart(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Origin);
