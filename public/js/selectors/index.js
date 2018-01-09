import moment from "moment";
import memoize from "lodash/memoize";

// If the state object is the same then just return the same obj
export const getFilters = memoize(({ filters }) => ({
    ...filters,
    values: {
        ...filters.values,
        startDate: moment(filters.values.startDate),
        endDate: moment(filters.values.endDate)
    }
}));

export const getIsUpdating = ({ isUpdating }) => isUpdating;

export const getFilterVals = state => getFilters(state).values;

const getArticleWordCounts = ({ articleWordCounts }) => articleWordCounts;

export const getWordCountArticles = state =>
    getArticleWordCounts(state).articles;

export const getWordCountAggregates = state =>
    getArticleWordCounts(state).aggregates;

export const getWordCountBands = state =>
    getWordCountAggregates(state).wordCountBands;

export const getCommissionedLengthBands = state =>
    getWordCountAggregates(state).commissionedLengthBands;

const sumCounts = arr => arr.reduce((sum, { count }) => sum + count, 0);

export const getArticleCount = state => sumCounts(getWordCountBands(state));
export const withCommissionedLengthCount = state =>
    sumCounts(getCommissionedLengthBands(state));

export const getWithoutCommissionedLengthCount = state =>
    getArticleCount(state) - withCommissionedLengthCount(state);
