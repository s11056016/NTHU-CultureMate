import assert from 'node:assert/strict';
import test from 'node:test';
import { knowledgeBase } from '../src/knowledge.js';
import { retrieve, formatAnswer } from '../src/rag.js';

test('retrieves bubble tea guidance for drink shop questions', () => {
  const [top] = retrieve('I want to order bubble tea with less ice', 'all', 1);
  assert.equal(top.entry.id, 'food-bubble-tea');
});

test('prioritizes campus insurance entry when module is selected', () => {
  const [top] = retrieve('When can I use National Health Insurance after ARC?', 'campus', 1);
  assert.equal(top.entry.id, 'campus-insurance');
  assert.equal(top.entry.credibility, 'official');
});

test('formats answers with all required MVP fields', () => {
  const answer = formatAnswer(knowledgeBase[0]);
  assert.deepEqual(Object.keys(answer), [
    'Short Answer',
    'Useful Chinese Sentence',
    'Pinyin',
    'English Meaning',
    'When to Use',
    'Cultural Note',
    'Source / Last Updated'
  ]);
});

test('official campus entries include source URLs and update dates', () => {
  const officialEntries = knowledgeBase.filter((entry) => entry.credibility === 'official');
  assert.ok(officialEntries.length >= 3);
  for (const entry of officialEntries) {
    assert.match(entry.source, /https:\/\//);
    assert.match(entry.lastUpdated, /^\d{4}-\d{2}-\d{2}$/);
  }
});
