import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const conversationPages = [
  './conversations/ask.html',
  './conversations/food.html',
  './conversations/campus.html',
  './conversations/social.html'
];

test('home module links open separate conversation pages', () => {
  const home = readFileSync('index.html', 'utf8');
  for (const page of conversationPages) {
    const href = page.replace('./', './');
    assert.match(home, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.ok(existsSync(page), `${page} should exist`);
  }
});

test('each conversation page declares a module and loads the shared app', () => {
  const expectedModules = ['all', 'food', 'campus', 'social'];
  conversationPages.forEach((page, index) => {
    const html = readFileSync(page, 'utf8');
    assert.match(html, new RegExp(`data-conversation-module="${expectedModules[index]}"`));
    assert.match(html, /<script type="module" src="\.\.\/src\/app\.js"><\/script>/);
  });
});
