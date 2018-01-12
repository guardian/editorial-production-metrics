import { createSelector } from "reselect";

/* Word Count */

const getArticleWordCounts = ({ articleWordCounts }) => articleWordCounts;

const getWordCountArticles = createSelector(
    getArticleWordCounts,
    ({ articles }) => articles
);

const getWordCountArticlesWithCommissionedLengthData = createSelector(
    getWordCountArticles,
    ({ articlesWithWordCount }) => articlesWithWordCount || {}
);

export const getWordCountArticlesWithCommissionedLength = createSelector(
    getWordCountArticlesWithCommissionedLengthData,
    ({ articles }) => articles || []
);

const getWordCountArticlesWithoutCommissionedLengthData = createSelector(
    getWordCountArticles,
    ({ articlesWithoutCommissionedLength }) =>
        articlesWithoutCommissionedLength || {}
);

export const getWordCountArticlesWithoutCommissionedLength = createSelector(
    getWordCountArticlesWithoutCommissionedLengthData,
    ({ articles }) => articles || []
);
