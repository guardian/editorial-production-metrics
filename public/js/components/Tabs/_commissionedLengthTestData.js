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

const articles = [
  {headline: "Meltdown and Spectre: ‘worst ever’ CPU bugs affect virtually all computers", path:"technology/2018/jan/04/meltdown-spectre-worst-cpu-bugs-ever-found-affect-computers-intel-processors-security-flaw", wordCount: 650, commissionedWordCount: 600},
  {headline: "Are there any good portable MP3 players for blind and visually impaired people?", path:"technology/askjack/2018/jan/04/apple-ipod-shuffle-good-mp3-portable-music-players-blind-visually-impaired-users", wordCount: 750, commissionedWordCount: 800},
  {headline: "Facebook declines to say why it deletes certain political accounts, but not others", path:"us-news/2018/jan/04/facebook-chechnya-ramzan-kadyrov-political-censorship", wordCount: 928, commissionedWordCount: 600},
  {headline: "Shares in spread betting firm Plus500 soar thanks to bitcoin boom ", path:"technology/2018/jan/03/spread-betting-firm-plus500s-shares-soar-bitcoin-boom", wordCount: 834, commissionedWordCount: 900},
  {headline: "Apple leads race to become world's first $1tn company", path:"business/2018/jan/03/apple-leads-race-to-become-world-first-1tn-dollar-company", wordCount: 340, commissionedWordCount: 350},
  {headline: "Neurotechnology, Elon Musk and the goal of human enhancement ", path:"technology/2018/jan/01/elon-musk-neurotechnology-human-enhancement-brain-computer-interfaces", wordCount: 1000, commissionedWordCount: 0},
]

export default {
  wordCountBands,
  commissionedLengthBands,
  articleCount, // number
  withCommissionedLengthCount, // number
  withoutCommissionedLengthCount, // number
  articles
};
