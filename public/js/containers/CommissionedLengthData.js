import { connect } from "react-redux";
import {
    getWithoutCommissionedLengthCount,
    getCommissionedLengthBands,
    getWordCountBands,
    getWordCountArticles
} from "../selectors/index";
import CommissionedLength from "../components/Tabs/CommissionedLength";

const mapStateToProps = state => ({
    commissionedLengthBands: getCommissionedLengthBands(state),
    withoutCommissionedLengthCount: getWithoutCommissionedLengthCount(state),
    wordCountBands: getWordCountBands(state),
    articles: getWordCountArticles(state)
});

export default connect(mapStateToProps)(CommissionedLength);
