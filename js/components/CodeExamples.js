export function createCodeExamples(concept) {
  const examples = concept.codeExamples
  if (!examples || examples.length === 0) return null

  let activeLang = examples[0].lang
  let activeTab = 'bad'
  let isOpen = false

  const wrapper = document.createElement('div')
  wrapper.className = 'code-examples-wrapper'

  // ── Toggle button ───────────────────────────────────────────
  const toggleBtn = document.createElement('button')
  toggleBtn.className = 'code-toggle-btn'
  toggleBtn.innerHTML = `<span class="code-toggle-icon">{;}</span> Ver ejemplos de código`
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen
    panel.classList.toggle('open', isOpen)
    toggleBtn.classList.toggle('active', isOpen)
    toggleBtn.innerHTML = isOpen
      ? `<span class="code-toggle-icon">{;}</span> Cerrar ejemplos`
      : `<span class="code-toggle-icon">{;}</span> Ver ejemplos de código`
    if (isOpen) {
      requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
    }
  })

  // ── Panel ───────────────────────────────────────────────────
  const panel = document.createElement('div')
  panel.className = 'code-panel'

  function getActive() {
    return examples.find(e => e.lang === activeLang) ?? examples[0]
  }

  function render() {
    const ex = getActive()
    panel.innerHTML = `
      <div class="code-lang-tabs" role="tablist" aria-label="Lenguaje de programación">
        ${examples.map(e => `
          <button
            class="code-lang-tab${e.lang === activeLang ? ' active' : ''}"
            data-lang="${e.lang}"
            role="tab"
            aria-selected="${e.lang === activeLang}"
          >${e.label}</button>
        `).join('')}
      </div>

      <div class="code-tab-group" role="tablist" aria-label="Ejemplo">
        <button class="code-view-tab${activeTab === 'bad' ? ' active bad' : ''}" data-tab="bad" role="tab">
          <span aria-hidden="true">✗</span> Sin el principio
        </button>
        <button class="code-view-tab${activeTab === 'good' ? ' active good' : ''}" data-tab="good" role="tab">
          <span aria-hidden="true">✓</span> Aplicándolo
        </button>
      </div>

      <div class="code-block-wrapper">
        <pre class="code-block"><code class="code-content language-${ex.lang === 'bash' ? 'bash' : ex.lang}">${escapeHtml(activeTab === 'bad' ? ex.bad : ex.good)}</code></pre>
      </div>
    `

    // highlight
    if (window.hljs) {
      panel.querySelectorAll('code.code-content').forEach(el => window.hljs.highlightElement(el))
    }

    // lang tab events
    panel.querySelectorAll('.code-lang-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeLang = btn.dataset.lang
        render()
      })
    })

    // view tab events
    panel.querySelectorAll('.code-view-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab
        render()
      })
    })
  }

  render()

  wrapper.appendChild(toggleBtn)
  wrapper.appendChild(panel)
  return wrapper
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
