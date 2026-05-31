import { knowledgeBase, moduleLabels } from './knowledge.js';
import { retrieve, formatAnswer } from './rag.js';

const state = { module: 'all' };

const moduleButtons = document.querySelectorAll('[data-module]');
const queryInput = document.querySelector('#query');
const askButton = document.querySelector('#ask-button');
const examples = document.querySelector('#examples');
const results = document.querySelector('#results');
const phraseGrid = document.querySelector('#phrase-grid');

function setModule(module) {
  state.module = module;
  moduleButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.module === module);
  });
  renderExamples();
  renderPhraseGrid();
}

function renderExamples() {
  const entries = knowledgeBase.filter((entry) => state.module === 'all' || entry.module === state.module).slice(0, 4);
  examples.innerHTML = entries.map((entry) => `<button class="example" type="button">${entry.aliases[0]}</button>`).join('');
  examples.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      queryInput.value = button.textContent;
      answer();
    });
  });
}

function renderPhraseGrid() {
  const entries = knowledgeBase.filter((entry) => state.module === 'all' || entry.module === state.module);
  phraseGrid.innerHTML = entries.map((entry) => `
    <article class="phrase-card ${entry.credibility}">
      <div class="card-topline">
        <span>${moduleLabels[entry.module]}</span>
        <strong>${entry.credibility === 'official' ? 'Official source' : 'Curated'}</strong>
      </div>
      <h3>${entry.title}</h3>
      <p class="zh">${entry.chinese}</p>
      <p class="pinyin">${entry.pinyin}</p>
      <p>${entry.english}</p>
    </article>
  `).join('');
}

function answer() {
  const query = queryInput.value;
  const matches = retrieve(query, state.module, 3);
  if (matches.length === 0) {
    results.innerHTML = '<p class="empty">Try asking about ordering food, NTHU insurance, scholarships, or talking with classmates.</p>';
    return;
  }
  results.innerHTML = matches.map(({ entry, score }, index) => {
    const answerFields = formatAnswer(entry);
    return `
      <article class="answer-card">
        <div class="match-meta">Match ${index + 1} · ${moduleLabels[entry.module]} · score ${score.toFixed(1)}</div>
        <h3>${entry.title}</h3>
        ${Object.entries(answerFields).map(([label, value]) => `
          <section>
            <h4>${label}</h4>
            <p>${value}</p>
          </section>
        `).join('')}
      </article>
    `;
  }).join('');
}

moduleButtons.forEach((button) => button.addEventListener('click', () => setModule(button.dataset.module)));
askButton.addEventListener('click', answer);
queryInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') answer();
});

setModule('all');
queryInput.value = 'How do I order bubble tea?';
answer();
