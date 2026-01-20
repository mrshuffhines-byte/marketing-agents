import express, { Response, Request } from 'express';
import { MarketingAgent, CampaignRequest } from '../agents/marketing-agent';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Store for tracking active campaigns
const activeCampaigns = new Map<string, {
  status: string;
  progress: number;
  message: string;
  result?: any;
  error?: string;
}>();

// Request validation schema
const campaignRequestSchema = z.object({
  brand: z.string().min(1),
  product: z.string().min(1),
  targetAudience: z.string().min(1),
  platforms: z.array(z.enum(['instagram', 'twitter', 'linkedin', 'tiktok', 'facebook'])).min(1),
  campaignGoal: z.string().min(1),
  tone: z.enum(['professional', 'casual', 'humorous', 'inspirational', 'educational']),
  constraints: z.array(z.string()).optional()
});

/**
 * POST /api/agent/campaign
 * Start a new campaign generation
 */
router.post('/campaign', async (req: Request, res: Response) => {
  try {
    const validatedData = campaignRequestSchema.parse(req.body);
    const campaignId = uuidv4();

    activeCampaigns.set(campaignId, {
      status: 'started',
      progress: 0,
      message: 'Campaign generation started'
    });

    // Start campaign generation asynchronously
    generateCampaignAsync(campaignId, validatedData as CampaignRequest);

    res.status(202).json({
      campaignId,
      status: 'started',
      message: 'Campaign generation started. Poll /api/agent/campaign/:id for status.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    console.error('Campaign creation error:', error);
    res.status(500).json({ error: 'Failed to start campaign generation' });
  }
});

/**
 * GET /api/agent/campaign/:id
 * Get campaign generation status
 */
router.get('/campaign/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = activeCampaigns.get(id);

  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  res.json({
    campaignId: id,
    ...campaign
  });
});

/**
 * GET /api/agent/campaign/:id/stream
 * Stream progress updates via Server-Sent Events
 */
router.get('/campaign/:id/stream', (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = activeCampaigns.get(id);

  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify(campaign)}\n\n`);

  const interval = setInterval(() => {
    const currentCampaign = activeCampaigns.get(id);
    if (currentCampaign) {
      res.write(`data: ${JSON.stringify(currentCampaign)}\n\n`);

      if (currentCampaign.status === 'completed' || currentCampaign.status === 'error') {
        clearInterval(interval);
        res.end();
      }
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

/**
 * GET /api/agent/campaigns
 * List all campaigns
 */
router.get('/campaigns', (req: Request, res: Response) => {
  const campaigns = Array.from(activeCampaigns.entries()).map(([id, data]) => ({
    campaignId: id,
    status: data.status,
    progress: data.progress
  }));

  res.json({ campaigns });
});

async function generateCampaignAsync(
  campaignId: string,
  request: CampaignRequest
): Promise<void> {
  const agent = new MarketingAgent();

  agent.getProgressTracker().on('progress', (update) => {
    const campaign = activeCampaigns.get(campaignId);
    if (campaign) {
      campaign.status = update.status;
      campaign.progress = update.progress || 0;
      campaign.message = update.message;
    }
  });

  try {
    const result = await agent.run(request);

    if (result.success) {
      activeCampaigns.set(campaignId, {
        status: 'completed',
        progress: 100,
        message: 'Campaign generation complete',
        result: result.output
      });
    } else {
      activeCampaigns.set(campaignId, {
        status: 'error',
        progress: 0,
        message: result.error || 'Unknown error',
        error: result.error
      });
    }
  } catch (error) {
    activeCampaigns.set(campaignId, {
      status: 'error',
      progress: 0,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default router;
