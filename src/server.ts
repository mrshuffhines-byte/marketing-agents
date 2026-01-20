import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './routes/agent';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'marketing-agents-api',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/agent', agentRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`
====================================
  Marketing Agents API
====================================
  Status:    Running
  Port:      ${PORT}
  Health:    http://localhost:${PORT}/health

  Endpoints:
  POST /api/agent/campaign     - Start campaign generation
  GET  /api/agent/campaign/:id - Get campaign status
  GET  /api/agent/campaign/:id/stream - SSE progress stream
  GET  /api/agent/campaigns    - List all campaigns
====================================
  `);
});
