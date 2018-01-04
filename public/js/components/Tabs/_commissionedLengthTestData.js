const wordCountBands = [
  { min: 0, max: 349, count: 78 },
  { min: 350, max: 599, count: 90 },
  { min: 600, max: 899, count: 71 },
  { min: 600, count: 12 }
];

const commissionedLengthBands = [
  { min: 0, max: 349, count: 78 },
  { min: 350, max: 599, count: 65 },
  { min: 600, max: 899, count: 41 },
  { min: 600, count: 12 }
];

const sumCounts = arr => arr.reduce((sum, { count }) => sum + count, 0);

const articleCount = sumCounts(wordCountBands);
const withCommissionedLengthCount = sumCounts(commissionedLengthBands);
const withoutCommissionedLengthCount = articleCount - withCommissionedLengthCount;

export default {
  wordCountBands,
  commissionedLengthBands,
  articleCount, // number
  withCommissionedLengthCount, // number
  withoutCommissionedLengthCount, // number
};
