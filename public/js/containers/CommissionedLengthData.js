import { connect } from "react-redux";
import {
    getWithoutCommissionedLengthCount,
    getCommissionedLengthBands,
    getWordCountBands
} from "../selectors/charts";
import {
    getWordCountArticlesWithCommissionedLength,
    getWordCountArticlesWithoutCommissionedLength
} from "../selectors/wordCountArticles";
import CommissionedLength from "../components/Tabs/CommissionedLength";

const mapStateToProps = state => ({
    commissionedLengthBands: getCommissionedLengthBands(state),
    withoutCommissionedLengthCount: getWithoutCommissionedLengthCount(state),
    wordCountBands: getWordCountBands(state),
    articlesWithCommissionedLength:
        getWordCountArticlesWithCommissionedLength(state),
    articlesWithoutCommissionedLength:
        getWordCountArticlesWithoutCommissionedLength(state)
});

export default connect(mapStateToProps)(CommissionedLength);
