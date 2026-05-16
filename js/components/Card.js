import { CATEGORIES } from '../data.js';
import { openModal } from './Modal.js';

export function createCard(concept, animIndex = 0) {
  const cat = CATEGORIES[concept.category];
  const card = document.createElement('article');

  card.className = 'card';
  card.style.setProperty('--accent', cat.color);
  card.style.animationDelay = `${animIndex * 45}ms`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ver detalle de ${concept.title}`);
  card.style.cursor = 'pointer';

  card.innerHTML = `
    <div class="card-category">
      <span class="card-dot" aria-hidden="true"></span>
      <span class="card-cat-label">${cat.label}</span>
    </div>
    <span class="card-icon" aria-hidden="true">${concept.icon}</span>
    <h2 class="card-title">${concept.title}</h2>
    <p class="card-description">${concept.description}</p>
    <div class="card-divider" aria-hidden="true"></div>
    <div class="card-solves-label">Qué resuelve</div>
    <p class="card-solves-text">${concept.solves}</p>
    <div class="card-read-more">Ver detalle <span aria-hidden="true">→</span></div>
  `;

  card.addEventListener('click', () => openModal(concept));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(concept);
    }
  });

  return card;
}

