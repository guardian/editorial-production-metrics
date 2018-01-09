import { connect } from "react-redux";
import { getForkTime } from "../selectors/charts";
import { getFilterVals, getIsUpdating } from "../selectors";
import { toggleStackChart } from "../actions";
import ForkTime from "../components/Tabs/ForkTime";

const mapStateToProps = state => ({
    charts: {
        forkTime: getForkTime(state)
    },
    filterVals: getFilterVals(state),
    isUpdating: getIsUpdating(state)
});

export default connect(mapStateToProps)(ForkTime);
