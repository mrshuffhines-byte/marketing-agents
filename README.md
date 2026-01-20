# Marketing Agents

A multi-agent marketing system for social media content generation powered by OpenAI GPT-4.

## Architecture

```
Marketing Agent (Orchestrator)
    ├── Research Agent → market trends, competitors, audience insights
    ├── Content Agent → platform-optimized posts, hashtags, CTAs
    └── Compliance Agent → brand, legal, platform policy review
```

Each agent has:
- **Skills**: Markdown files loaded into system prompts
- **Tools**: Functions the agent can call during execution

## Features

- 4-phase campaign generation (Research → Content → Compliance → Assembly)
- Platform-specific content for Instagram, Twitter, LinkedIn, TikTok, Facebook
- Real-time progress tracking via Server-Sent Events (SSE)
- Compliance checking for brand guidelines, legal requirements, and platform policies
- Extensible skills and tools system

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### 3. Start the server

```bash
npm run dev
```

Server runs on http://localhost:3002

## API Endpoints

### Generate Campaign

```bash
POST /api/agent/campaign
```

Request body:
```json
{
  "brand": "YourBrand",
  "product": "Your Product",
  "targetAudience": "Your target audience",
  "platforms": ["instagram", "twitter", "linkedin"],
  "campaignGoal": "Increase brand awareness",
  "tone": "professional"
}
```

Response:
```json
{
  "campaignId": "uuid",
  "status": "started",
  "message": "Campaign generation started..."
}
```

### Check Status

```bash
GET /api/agent/campaign/:id
```

### Stream Progress (SSE)

```bash
GET /api/agent/campaign/:id/stream
```

### List Campaigns

```bash
GET /api/agent/campaigns
```

## Project Structure

```
marketing-agents/
├── src/
│   ├── server.ts              # Express entry point
│   ├── agents/                # Agent implementations
│   │   ├── base-agent.ts      # Abstract base class
│   │   ├── marketing-agent.ts # Orchestrator
│   │   ├── research-agent.ts
│   │   ├── content-agent.ts
│   │   └── compliance-agent.ts
│   ├── skills/                # Markdown prompt files
│   │   ├── marketing/
│   │   ├── research/
│   │   ├── content/
│   │   └── compliance/
│   ├── tools/                 # Tool implementations
│   │   ├── tool-registry.ts
│   │   ├── research-tools.ts
│   │   ├── content-tools.ts
│   │   └── compliance-tools.ts
│   ├── lib/                   # Core utilities
│   │   ├── openai.ts
│   │   ├── skill-loader.ts
│   │   ├── progress-tracker.ts
│   │   └── types.ts
│   └── routes/
│       └── agent.ts
├── package.json
└── tsconfig.json
```

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `PORT` | Server port (default: 3002) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Tone Options

- `professional` - Corporate, polished
- `casual` - Friendly, approachable
- `humorous` - Witty, fun
- `inspirational` - Motivating, uplifting
- `educational` - Informative, teaching

## Extending the System

### Adding a New Skill

Create a markdown file in `src/skills/{agent}/`:

```markdown
# Skill Name

Instructions and knowledge for the agent...
```

Then add the path to the agent's `skillPaths` array.

### Adding a New Tool

1. Define the tool schema in `src/tools/tool-registry.ts`
2. Implement the function in the appropriate tools file
3. Add the case to the agent's `executeToolCall` method

## License

ISC
