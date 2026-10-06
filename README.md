# AI Video + Game Maker Studio

A production-ready AI-powered creative studio for generating video concepts, game designs, and playable prototypes.

## Features

- **AI-Powered Generation**: Uses OpenAI GPT-4o for creative concept generation
- **Video Generation**: Replicate integration for AI video synthesis
- **User Accounts**: Secure authentication with JWT and bcrypt
- **Project Management**: Save, load, and export projects to JSON
- **Playable Prototypes**: Built-in browser-based mini-game preview
- **Production Ready**: Database-backed, scalable, deployable

## Setup

### Local Development

```bash
npm install
npm run migrate
npm run dev
```

Open http://localhost:3000

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
OPENAI_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_token_here
DATABASE_URL=postgresql://user:password@localhost:5432/ai_studio
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=production
```

## Database Setup

### PostgreSQL (Recommended)

```bash
createdb ai_studio
node migrate.js
```

## Deployment

### Heroku

```bash
heroku create ai-video-game-maker
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set OPENAI_API_KEY=your_key
heroku config:set REPLICATE_API_TOKEN=your_token
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Docker

```bash
docker build -t ai-studio .
docker run -e DATABASE_URL=postgresql://... -p 3000:3000 ai-studio
```

### Vercel

Use Vercel for the frontend + serverless functions for the API.

## API Endpoints

### Auth

- `POST /api/register` - Register new user
- `POST /api/login` - Login and get JWT token

### Projects

- `GET /api/projects` - List all projects (requires auth)
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `GET /api/generate` - Generate video + game concepts
- `POST /api/generate-video` - Generate video with Replicate
- `GET /api/export/:projectId` - Export project as JSON

## License

MIT
