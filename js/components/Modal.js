import { CATEGORIES } from '../data.js';
import { createCodeExamples } from './CodeExamples.js';

let activeModal = null;

function parseDetail(text) {
  return text
    .split('\n\n')
    .map(para => {
      const withBold = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      return `<p>${withBold}</p>`;
    })
    .join('');
}

function renderModal(concept) {
  const cat = CATEGORIES[concept.category];

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', concept.title);

  overlay.innerHTML = `
    <div class="modal-panel" style="--accent: ${cat.color}">
      <div class="modal-header">
        <div class="modal-meta">
          <span class="modal-cat-dot" aria-hidden="true"></span>
          <span class="modal-cat-label">${cat.label}</span>
        </div>
        <button class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-title-row">
          <span class="modal-icon" aria-hidden="true">${concept.icon}</span>
          <h2 class="modal-title">${concept.title}</h2>
        </div>

        <div class="modal-section">
          <div class="modal-section-label">Descripción</div>
          <div class="modal-detail-text">${parseDetail(concept.detail)}</div>
        </div>

        <div class="modal-section">
          <div class="modal-section-label">Puntos clave</div>
          <ul class="modal-points">
            ${concept.points.map(p => `<li class="modal-point"><span class="point-marker" aria-hidden="true"></span>${p}</li>`).join('')}
          </ul>
        </div>

        <div class="modal-solves-box">
          <div class="modal-section-label">Qué resuelve</div>
          <p class="modal-solves-text">${concept.solves}</p>
        </div>

        <div id="modal-code-slot"></div>
      </div>
    </div>
  `;

  // inject code examples if available
  if (concept.codeExamples?.length) {
    const slot = overlay.querySelector('#modal-code-slot');
    const codeExamples = createCodeExamples(concept);
    if (codeExamples) slot.appendChild(codeExamples);
  }

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', handleEsc);

  return overlay;
}

function handleEsc(e) {
  if (e.key === 'Escape') closeModal();
}

export function openModal(concept) {
  if (activeModal) closeModal(false);

  const modal = renderModal(concept);
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    modal.classList.add('visible');
  });

  activeModal = modal;
}

function closeModal(animate = true) {
  if (!activeModal) return;

  const modal = activeModal;
  activeModal = null;
  document.removeEventListener('keydown', handleEsc);

  if (animate) {
    modal.classList.remove('visible');
    modal.addEventListener('transitionend', () => {
      modal.remove();
      document.body.style.overflow = '';
    }, { once: true });
  } else {
    modal.remove();
    document.body.style.overflow = '';
  }
}

