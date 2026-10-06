* {
  box-sizing: border-box;
}

:root {
  --bg: #07131d;
  --bg-2: #0d1d2d;
  --panel: rgba(12, 20, 31, 0.82);
  --panel-alt: rgba(18, 28, 40, 0.88);
  --primary: #7c3aed;
  --primary-2: #22d3ee;
  --accent: #f97316;
  --text: #edf5ff;
  --muted: #aac0dd;
  --line: rgba(170, 192, 221, 0.2);
  --shadow: 0 28px 55px rgba(5, 11, 18, 0.48);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: 'Inter', sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.35), transparent 28%),
    radial-gradient(circle at bottom left, rgba(34, 211, 238, 0.18), transparent 34%),
    linear-gradient(180deg, var(--bg), var(--bg-2));
}

body {
  display: flex;
  justify-content: center;
  padding: 30px;
}

button, input, textarea, select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  width: min(1200px, 100%);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 18px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: white;
  font-weight: 800;
  box-shadow: var(--shadow);
}

h1, h2, h3, p {
  margin: 0;
}

h1 {
  font-size: clamp(1.6rem, 3vw, 2.3rem);
}

h2 {
  font-size: clamp(1.2rem, 2.4vw, 1.7rem);
}

h3 {
  font-size: 1.12rem;
}

.eyebrow {
  color: var(--muted);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.72rem;
  margin-bottom: 6px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.primary-btn, .secondary-btn, .ghost-btn {
  border-radius: 12px;
  border: 1px solid var(--line);
  padding: 0.88rem 1.15rem;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.primary-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  border-color: transparent;
  color: white;
  font-weight: 700;
}

.secondary-btn {
  background: rgba(124, 58, 237, 0.1);
  color: var(--text);
}

.ghost-btn {
  background: transparent;
  color: var(--text);
}

.primary-btn:hover, .secondary-btn:hover, .ghost-btn:hover {
  transform: translateY(-1px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.25fr;
  gap: 22px;
  margin-bottom: 22px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 22px;
  backdrop-filter: blur(10px);
}

.generator-panel {
  min-height: 430px;
}

.panel-header {
  margin-bottom: 16px;
}

textarea, input, select {
  width: 100%;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(8, 17, 27, 0.72);
  color: var(--text);
  padding: 14px 16px;
}

textarea {
  min-height: 150px;
  resize: vertical;
  line-height: 1.5;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-size: 0.9rem;
}

.action-row {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.status-box {
  margin-top: 18px;
  padding: 14px 16px;
  background: rgba(34, 211, 238, 0.07);
  border: 1px solid rgba(34, 211, 238, 0.26);
  border-radius: 14px;
}

.label {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

#gameCanvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 18px;
  background: linear-gradient(180deg, #0d1a29 0%, #132e41 42%, #19415e 100%);
  border: 1px solid rgba(34, 211, 238, 0.2);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.card {
  min-height: 260px;
}

.wide-card {
  grid-column: 1 / -1;
}

.card-header {
  margin-bottom: 12px;
}

.result-copy {
  line-height: 1.65;
  color: var(--text);
  margin-bottom: 16px;
}

.chip-list {
  list-style: none;
  margin: 0 0 18px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-list li {
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.35);
  color: #e7edff;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.83rem;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--muted);
  font-size: 0.82rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.summary-grid > div {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line);
}

@media (max-width: 900px) {
  .dashboard-grid,
  .results-grid,
  .field-grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
