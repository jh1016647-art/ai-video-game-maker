const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function sentenceCase(str) {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateVideoOutline(prompt) {
  const cleaned = (prompt || 'a futuristic city adventure').trim();
  const theme = sentenceCase(cleaned);
  const mood = ['cinematic', 'dreamlike', 'high-energy', 'epic', 'moody'][Math.floor(Math.random() * 5)];
  const palette = ['Neon Cyan & Midnight Blue', 'Sunset Gold & Crimson', 'Forest Emerald & Stone', 'Electric Purple & Silver'][Math.floor(Math.random() * 4)];

  return {
    title: `${titleCase(cleaned)}: ${mood} Short`,
    concept: `A ${mood} visual story about ${theme}, designed as a high-impact short-form video with dynamic camera movement and layered visual storytelling.`,
    style: palette,
    duration: `${Math.floor(30 + Math.random() * 60)} seconds`,
    shots: [
      `Establishing shot of ${theme} with a dramatic wide angle`,
      'Hero action sequence with quick cuts, motion blur, and stylized transitions',
      'Character close-up revealing emotional stakes and tension',
      'Visual payoff scene with layered effects and strong color contrast',
      'Final reveal using slow motion and atmospheric sound cues'
    ],
    hook: `Open on the most visually striking scene from ${theme} to instantly capture attention.`
  };
}

function generateGameDesign(prompt) {
  const cleaned = (prompt || 'adventure game').trim();
  const theme = sentenceCase(cleaned);
  const mechanics = [
    'Dash through hazards while timing jumps for combo chains',
    'Collect energy shards to unlock buffs and special attacks',
    'Solve environmental puzzles to progress to hidden routes',
    'Use stealth and movement to evade patrols and reach objectives'
  ];

  return {
    title: `${titleCase(cleaned)} Quest`,
    genre: ['Action Adventure', 'Rogue-lite Runner', 'Puzzle Platformer', 'Sci-Fi Survival'][Math.floor(Math.random() * 4)],
    objective: `Guide the hero through ${theme} while surviving hazards, collecting power-ups, and reaching the final objective.`,
    mechanics: [
      mechanics[Math.floor(Math.random() * mechanics.length)],
      'Progress through a short level loop with escalating challenge',
      'Dynamic score system rewards speed, precision, and exploration'
    ],
    pillars: [
      'Fast movement and satisfying interaction',
      'Readable level progression and meaningful reward loops',
      'Strong theme-driven art direction and audiovisual feedback'
    ],
    levelIdea: `A compact arena level inspired by ${theme}, with layered routes, collectible upgrades, and a final boss encounter.`
  };
}

app.get('/api/generate', (req, res) => {
  const prompt = req.query.prompt || 'cyberpunk dragon rescue';

  const video = generateVideoOutline(prompt);
  const game = generateGameDesign(prompt);

  res.json({
    prompt,
    video,
    game,
    generatedAt: new Date().toISOString()
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'AI Video and Game Maker' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Video and Game Maker running on http://localhost:${PORT}`);
});
