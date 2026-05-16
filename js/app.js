import { concepts, CATEGORIES } from './data.js';
import { renderHeader } from './components/Header.js';
import { createCard } from './components/Card.js';

// ─── State ──────────────────────────────────────────────────
let activeCategory = 'all';

// ─── Theme ──────────────────────────────────────────────────
const savedTheme = localStorage.getItem('devprinciples-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ─── Filter Bar ─────────────────────────────────────────────
function countByCategory(key) {
  return key === 'all'
    ? concepts.length
    : concepts.filter(c => c.category === key).length;
}

function createFilterButton(label, key, color) {
  const btn = document.createElement('button');
  btn.className = `filter-btn${activeCategory === key ? ' active' : ''}`;
  btn.dataset.key = key;
  btn.setAttribute('aria-pressed', String(activeCategory === key));

  if (color) btn.style.setProperty('--cat-color', color);

  btn.innerHTML = `${label} <span class="filter-count">${countByCategory(key)}</span>`;

  btn.addEventListener('click', () => {
    if (activeCategory === key) return;
    activeCategory = key;
    refreshFilterBar();
    refreshGrid();
  });

  return btn;
}

function renderFilterBar() {
  const bar = document.createElement('nav');
  bar.className = 'filter-bar';
  bar.id = 'filter-bar';
  bar.setAttribute('aria-label', 'Filtrar por categoría');

  bar.appendChild(createFilterButton('Todos', 'all', null));

  Object.values(CATEGORIES).forEach(cat => {
    bar.appendChild(createFilterButton(cat.label, cat.key, cat.color));
  });

  return bar;
}

function refreshFilterBar() {
  const existing = document.getElementById('filter-bar');
  if (!existing) return;
  const newBar = renderFilterBar();
  existing.replaceWith(newBar);
}

// ─── Cards Grid ─────────────────────────────────────────────
function renderGrid() {
  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  grid.id = 'cards-grid';
  grid.setAttribute('role', 'list');

  const filtered = activeCategory === 'all'
    ? concepts
    : concepts.filter(c => c.category === activeCategory);

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No hay conceptos en esta categoría.';
    grid.appendChild(empty);
    return grid;
  }

  filtered.forEach((concept, i) => {
    const card = createCard(concept, i);
    card.setAttribute('role', 'listitem');
    grid.appendChild(card);
  });

  return grid;
}

function refreshGrid() {
  const existing = document.getElementById('cards-grid');
  if (!existing) return;
  existing.replaceWith(renderGrid());
}

// ─── Hero ────────────────────────────────────────────────────
function renderHero() {
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.setAttribute('aria-label', 'Introducción');

  hero.innerHTML = `
    <h1 class="hero-title">Principios del <em>buen código</em></h1>
    <p class="hero-sub">
      Los conceptos que separan el código que crece del código que duele.
    </p>
  `;

  return hero;
}

// ─── App Mount ───────────────────────────────────────────────
function mount() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  app.appendChild(renderHeader());

  const main = document.createElement('main');
  main.className = 'main';
  main.appendChild(renderHero());
  main.appendChild(renderFilterBar());
  main.appendChild(renderGrid());

  app.appendChild(main);
}

mount();
