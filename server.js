import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OpenAI } from 'openai';
import Replicate from 'replicate';
import { initDb, query } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const replicate = process.env.REPLICATE_API_TOKEN ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN }) : null;

await initDb();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
    req.user = user;
    next();
  });
}

function titleCase(str = '') {
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function sentenceCase(str = '') {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());
}

function buildMockVideo(prompt = 'cyberpunk dragon rescue', style = 'cinematic') {
  const cleaned = sentenceCase(prompt);
  const palettes = {
    cinematic: 'Neon Cyan & Midnight Blue',
    anime: 'Electric Purple & Silver',
    realistic: 'Sunset Gold & Crimson',
    dreamy: 'Forest Emerald & Lavender',
    retro: 'Pixel Coral & Aqua'
  };

  return {
    title: `${titleCase(prompt)} — ${style} storyboard`,
    concept: `A ${style} visual storyboard exploring ${cleaned}, blending atmosphere, motion, and a decisive payoff.`,
    duration: '45 seconds',
    style,
    palette: palettes[style] || palettes.cinematic,
    shots: [
      `Wide establishing shot of ${cleaned} from a dramatic angle`,
      'Hero movement beat with layered motion and dynamic framing',
      'Character close-up highlighting the emotional shift',
      'Payoff sequence with enhanced contrast and effects',
      'Final reveal using atmosphere and slow-motion cadence'
    ],
    hook: `Open on the most striking image from ${cleaned} to lock the viewer immediately.`
  };
}

function buildMockGame(prompt = 'cyberpunk dragon rescue', genre = 'action') {
  const cleaned = sentenceCase(prompt);
  const genres = {
    action: 'Action Adventure',
    puzzle: 'Puzzle Platformer',
    racing: 'High-Speed Racing',
    roguelike: 'Rogue-lite Survival'
  };

  return {
    title: `${titleCase(prompt)} Quest`,
    genre: genres[genre] || 'Action Adventure',
    objective: `Guide the player through ${cleaned} by surviving hazards, unlocking upgrades, and reaching the final objective.`,
    mechanics: [
      'Fast movement and responsive jump controls',
      'Collectible power-ups and skill upgrades',
      'Dynamic enemy and environmental hazard patterns',
      'Short challenge loops with escalating rewards'
    ],
    levelIdea: `A compact vertical arena inspired by ${cleaned}, with hidden routes, collectibles, and a final boss lane.`
  };
}

async function generateWithAI(prompt, type, fallback) {
  if (!openai) return fallback;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `You are a creative director for a game and video concept studio. Return valid JSON for ${type}.`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const text = response.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error(`AI generation failed for ${type}:`, error.message);
    return fallback;
  }
}

async function generateVideoWithReplicate(prompt) {
  if (!replicate) return null;

  try {
    console.log('[VIDEO] Starting generation with Replicate for:', prompt);
    const output = await replicate.run(
      'damo-vilab/text-to-video:1e205ea73084bd17a5553592ace998d37fbb16b4e5a771d5d1d2e76b6c4ab58a',
      {
        inputs: {
          prompt: prompt,
          num_frames: 25,
          fps: 6
        }
      }
    );
    console.log('[VIDEO] Generation complete. Output:', output);
    return output;
  } catch (error) {
    console.error('[VIDEO] Replicate generation failed:', error.message);
    return null;
  }
}

async function createVideoConcept(prompt, style) {
  const fallback = buildMockVideo(prompt, style);
  const aiPrompt = `Create a creative video storyboard JSON with fields: title, concept, duration, style, palette, shots (array), hook. Prompt: ${prompt}. Style: ${style}.`;
  const result = await generateWithAI(aiPrompt, 'video', fallback);

  return {
    ...fallback,
    ...result,
    shots: Array.isArray(result.shots) ? result.shots : fallback.shots,
    title: result.title || fallback.title,
    concept: result.concept || fallback.concept,
    style: result.style || style,
    palette: result.palette || fallback.palette,
    hook: result.hook || fallback.hook,
    duration: result.duration || fallback.duration
  };
}

async function createGameConcept(prompt, genre) {
  const fallback = buildMockGame(prompt, genre);
  const aiPrompt = `Create a game design JSON with fields: title, genre, objective, mechanics (array), levelIdea. Prompt: ${prompt}. Genre: ${genre}.`;
  const result = await generateWithAI(aiPrompt, 'game', fallback);

  return {
    ...fallback,
    ...result,
    title: result.title || fallback.title,
    genre: result.genre || fallback.genre,
    objective: result.objective || fallback.objective,
    mechanics: Array.isArray(result.mechanics) ? result.mechanics : fallback.mechanics,
    levelIdea: result.levelIdea || fallback.levelIdea
  };
}

app.get('/api/health', async (_req, res) => {
  res.json({
    status: 'ok',
    name: 'AI Video and Game Maker',
    version: '3.0.0',
    aiEnabled: Boolean(openai),
    videoEnabled: Boolean(replicate),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      user,
      token,
      message: `Welcome, ${user.username}!`
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Username or email already exists.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required.' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
      token,
      message: `Logged in as ${user.username}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json({ projects: result.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { title, prompt, style, genre, video_data, game_data } = req.body || {};

  try {
    const result = await query(
      'INSERT INTO projects (user_id, title, prompt, style, genre, video_data, game_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, title || 'New Project', prompt, style, genre, video_data, game_data]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const { title, prompt, style, genre, video_data, game_data, video_url, video_status } = req.body || {};
  const projectId = req.params.id;

  try {
    const result = await query(
      'UPDATE projects SET title = COALESCE($1, title), prompt = COALESCE($2, prompt), style = COALESCE($3, style), genre = COALESCE($4, genre), video_data = COALESCE($5, video_data), game_data = COALESCE($6, game_data), video_url = COALESCE($7, video_url), video_status = COALESCE($8, video_status), updated_at = CURRENT_TIMESTAMP WHERE id = $9 AND user_id = $10 RETURNING *',
      [title, prompt, style, genre, video_data, game_data, video_url, video_status, projectId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/generate', authenticateToken, async (req, res) => {
  const prompt = req.query.prompt || 'cyberpunk dragon rescue';
  const style = req.query.style || 'cinematic';
  const genre = req.query.genre || 'action';

  try {
    const [video, game] = await Promise.all([
      createVideoConcept(prompt, style),
      createGameConcept(prompt, genre)
    ]);

    res.json({
      prompt,
      style,
      genre,
      video,
      game,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/generate-video', authenticateToken, async (req, res) => {
  const { projectId, prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  try {
    const videoUrl = await generateVideoWithReplicate(prompt);

    if (projectId) {
      await query(
        'UPDATE projects SET video_url = $1, video_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4',
        [videoUrl || null, videoUrl ? 'complete' : 'pending', projectId, req.user.id]
      );
    }

    res.json({
      success: true,
      videoUrl,
      status: videoUrl ? 'complete' : 'pending',
      message: videoUrl ? 'Video generated successfully.' : 'Video generation queued. Check back soon.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/export/:projectId', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.projectId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const project = result.rows[0];
    res.setHeader('Content-Disposition', `attachment; filename="${project.title.replace(/\s+/g, '-').toLowerCase()}.json"`);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🎬 AI Video and Game Maker running at http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL || 'sqlite (dev mode)'}`);
  console.log(`🤖 AI Enabled: ${Boolean(openai)}`);
  console.log(`🎥 Video Generation: ${Boolean(replicate)}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
