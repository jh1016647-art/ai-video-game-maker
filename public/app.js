* {
  box-sizing: border-box;
}

:root {
  --bg: #08111f;
  --panel: rgba(14, 22, 36, 0.9);
  --panel-light: rgba(21, 33, 50, 0.8);
  --primary: #7c3aed;
  --primary-2: #22d3ee;
  --accent: #f97316;
  --text: #e5eefb;
  --muted: #9cb0d0;
  --line: rgba(156, 176, 208, 0.2);
  --shadow: 0 20px 45px rgba(13, 18, 31, 0.45);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: 'Inter', sans-serif;
  background:
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.45), transparent 30%),
    radial-gradient(circle at bottom left, rgba(34, 211, 238, 0.22), transparent 35%),
    var(--bg);
  color: var(--text);
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

button, textarea {
  font: inherit;
}

.page-shell {
  width: min(1200px, 100%);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: white;
  font-weight: 800;
}

h1, h2, h3, p {
  margin: 0;
}

h1 {
  font-size: clamp(1.7rem, 3vw, 2.2rem);
}

h2 {
  font-size: clamp(1.2rem, 2vw, 1.6rem);
}

h3 {
  font-size: 1.1rem;
}

.eyebrow {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.app-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap: 22px;
  margin-bottom: 22px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 22px;
  backdrop-filter: blur(8px);
}

label {
  display: block;
  margin-bottom: 10px;
  color: var(--muted);
  font-size: 0.9rem;
}

textarea {
  width: 100%;
  min-height: 170px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(7, 15, 28, 0.7);
  color: var(--text);
  padding: 16px 16px;
  line-height: 1.5;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn, .ghost-btn {
  border-radius: 12px;
  border: 1px solid transparent;
  padding: 0.9rem 1.2rem;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.primary-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #f9fbff;
  font-weight: 700;
}

.secondary-btn {
  background: rgba(124, 58, 237, 0.12);
  border-color: rgba(124, 58, 237, 0.5);
  color: var(--text);
}

.ghost-btn {
  background: transparent;
  border-color: var(--line);
  color: var(--text);
}

.primary-btn:hover, .secondary-btn:hover, .ghost-btn:hover {
  transform: translateY(-1px);
}

.status-box {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(48, 100, 162, 0.12);
  border: 1px solid rgba(34, 211, 238, 0.24);
}

.label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
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
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(180deg, #0d1b2a, #101f37 35%, #182f3c 100%);
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 18px;
  display: block;
}

.result-panel {
  min-height: 260px;
}

.panel-header {
  margin-bottom: 12px;
}

.result-copy {
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 16px;
}

.chip-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-list li {
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.25);
  color: #dfe6ff;
  font-size: 0.82rem;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--muted);
  font-size: 0.82rem;
}

@media (max-width: 820px) {
  .app-grid,
  .results-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
