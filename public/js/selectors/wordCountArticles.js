import { createSelector } from "reselect";
import { wordCountOver } from "../utils/WordCountUtils";

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

const byWordCountOver = (a, b) => wordCountOver(b) - wordCountOver(a);
const byWordCount = (a, b) => b.wordCount - a.wordCount;

export const getWordCountArticlesWithCommissionedLength = createSelector(
    getWordCountArticlesWithCommissionedLengthData,
    ({ articles }) => (articles || []).slice(0).sort(byWordCountOver)
);

const getWordCountArticlesWithoutCommissionedLengthData = createSelector(
    getWordCountArticles,
    ({ articlesWithoutCommissionedLength }) =>
        articlesWithoutCommissionedLength || {}
);

export const getWordCountArticlesWithoutCommissionedLength = createSelector(
    getWordCountArticlesWithoutCommissionedLengthData,
    ({ articles }) =>
        (articles || [])
            .slice(0)
            .sort(byWordCount)
);
