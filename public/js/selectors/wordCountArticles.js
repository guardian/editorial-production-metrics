import { createSelector } from "reselect";

/* Word Count */

const getArticleWordCounts = ({ articleWordCounts }) => console.log(articleWordCounts) || articleWordCounts;

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
    ({ articlesWithoutCommissionedLength }) => console.log(articlesWithoutCommissionedLength) ||
        articlesWithoutCommissionedLength || {}
);

export const getWordCountArticlesWithoutCommissionedLength = createSelector(
    getWordCountArticlesWithoutCommissionedLengthData,
    ({ articles }) => articles || []
);
