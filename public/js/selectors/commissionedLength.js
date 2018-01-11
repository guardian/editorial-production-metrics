import { createSelector } from "reselect";

const getArticleWordCounts = ({ articleWordCounts }) => articleWordCounts;

export const getWordCountArticles = createSelector(
    getArticleWordCounts,
    ({ articles }) => articles
);

export const getWordCountAggregates = createSelector(
    getArticleWordCounts,
    ({ aggregates }) => aggregates
);

export const getWordCountBands = createSelector(
    getWordCountAggregates,
    ({ wordCountBands }) => wordCountBands
);

export const getCommissionedLengthBands = createSelector(
    getWordCountAggregates,
    ({ commissionedLengthBands }) => commissionedLengthBands
);

const sumCounts = arr => arr.reduce((sum, { count }) => sum + count, 0);

export const getArticleCount = createSelector(
    getWordCountBands,
    wordCountBands => sumCounts(wordCountBands)
);

export const getWithCommissionedLengthCount = createSelector(
    getCommissionedLengthBands,
    commissionedLengthBands => sumCounts(commissionedLengthBands)
);

export const getWithoutCommissionedLengthCount = createSelector(
    getArticleCount,
    getWithCommissionedLengthCount,
    (articleCount, commissionedLengthCount) =>
        articleCount - commissionedLengthCount
);
