import { knowledgeBase } from './knowledge.js';

const normalize = (value) => value.toLowerCase().replace(/[?.,!;:()[\]"'`]/g, ' ').replace(/\s+/g, ' ').trim();

export function tokenize(query) {
  return normalize(query).split(' ').filter(Boolean);
}

function containsAnyNeedle(haystack, needles) {
  const normalizedHaystack = normalize(haystack);
  return needles.some((needle) => normalizedHaystack.includes(normalize(needle)));
}

export function scoreEntry(entry, query, preferredModule = 'all') {
  const tokens = tokenize(query);
  const searchable = [
    entry.module,
    entry.title,
    entry.shortAnswer,
    entry.chinese,
    entry.english,
    entry.whenToUse,
    entry.culturalNote,
    ...entry.aliases,
    ...entry.keywords
  ].join(' ');

  let score = 0;
  if (preferredModule !== 'all' && entry.module === preferredModule) score += 8;
  if (entry.credibility === 'official') score += 1.25;
  for (const token of tokens) {
    if (containsAnyNeedle(searchable, [token])) score += 2;
    if (entry.keywords.some((keyword) => normalize(keyword) === token)) score += 3;
  }
  if (containsAnyNeedle(query, entry.aliases)) score += 5;
  return score;
}

export function retrieve(query, preferredModule = 'all', limit = 3) {
  const safeQuery = query.trim() || preferredModule;
  return knowledgeBase
    .map((entry) => ({ entry, score: scoreEntry(entry, safeQuery, preferredModule) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit);
}

export function formatAnswer(entry) {
  return {
    'Short Answer': entry.shortAnswer,
    'Useful Chinese Sentence': entry.chinese,
    Pinyin: entry.pinyin,
    'English Meaning': entry.english,
    'When to Use': entry.whenToUse,
    'Cultural Note': entry.culturalNote,
    'Source / Last Updated': `${entry.source} (Last updated: ${entry.lastUpdated})`
  };
}
