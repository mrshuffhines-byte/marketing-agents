# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server with hot reload (tsx watch)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled production build
```

Server runs on port 3002 by default.

## Architecture Overview

### Multi-Agent System
Four AI agents orchestrated by the Marketing Agent:

1. **Marketing Agent** (`src/agents/marketing-agent.ts`): Orchestrates 4-phase campaign workflow
2. **Research Agent** (`src/agents/research-agent.ts`): Market trends, competitors, audience insights
3. **Content Agent** (`src/agents/content-agent.ts`): Platform-optimized social media posts
4. **Compliance Agent** (`src/agents/compliance-agent.ts`): Brand, legal, platform policy review

All agents extend `BaseAgent` (`src/agents/base-agent.ts`) which provides:
- Skill loading from markdown files
- Tool execution loop with OpenAI function calling
- Conversation history management
- Progress tracking

### Skills System
Markdown files in `src/skills/` are loaded into agent system prompts:
- `skills/marketing/orchestration.md`
- `skills/research/market-analysis.md`
- `skills/content/social-media.md`
- `skills/compliance/brand-guidelines.md`

### Tools System
Functions agents can call during execution:
- `src/tools/tool-registry.ts`: Tool definitions (OpenAI function schemas)
- `src/tools/research-tools.ts`: Market research functions
- `src/tools/content-tools.ts`: Content optimization functions
- `src/tools/compliance-tools.ts`: Compliance checking functions

### API Routes
- `POST /api/agent/campaign`: Start async campaign generation
- `GET /api/agent/campaign/:id`: Poll for status/results
- `GET /api/agent/campaign/:id/stream`: SSE progress stream
- `GET /api/agent/campaigns`: List all campaigns

### Key Patterns
- OpenAI client uses lazy initialization (`src/lib/openai.ts`) to ensure env vars are loaded
- Progress tracking via EventEmitter (`src/lib/progress-tracker.ts`)
- Campaign state stored in-memory Map (not persisted)

## Environment Variables

Required: `OPENAI_API_KEY`
Optional: `PORT` (default 3002), `NODE_ENV`
