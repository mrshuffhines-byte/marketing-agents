import { ToolDefinition } from '../lib/types';

export function getResearchTools(): ToolDefinition[] {
  return [
    {
      type: 'function',
      function: {
        name: 'search_market_trends',
        description: 'Search for current market trends in a specific industry',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query for trends' },
            industry: { type: 'string', description: 'Industry category' }
          },
          required: ['query']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'analyze_competitors',
        description: 'Analyze competitor social media strategies',
        parameters: {
          type: 'object',
          properties: {
            competitors: { type: 'array', items: { type: 'string' }, description: 'List of competitor names' },
            platform: { type: 'string', description: 'Platform to analyze' }
          },
          required: ['competitors', 'platform']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'get_trending_hashtags',
        description: 'Get trending hashtags for a platform and category',
        parameters: {
          type: 'object',
          properties: {
            platform: { type: 'string' },
            category: { type: 'string' }
          },
          required: ['platform', 'category']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'analyze_audience_demographics',
        description: 'Get demographic insights for a target audience',
        parameters: {
          type: 'object',
          properties: {
            targetAudience: { type: 'string', description: 'Description of target audience' }
          },
          required: ['targetAudience']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'get_platform_insights',
        description: 'Get platform-specific engagement insights',
        parameters: {
          type: 'object',
          properties: {
            platform: { type: 'string' }
          },
          required: ['platform']
        }
      }
    }
  ];
}

export function getContentTools(): ToolDefinition[] {
  return [
    {
      type: 'function',
      function: {
        name: 'check_character_count',
        description: 'Check if text meets platform character limits',
        parameters: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            platform: { type: 'string' }
          },
          required: ['text', 'platform']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'optimize_hashtags',
        description: 'Optimize hashtag selection for reach and engagement',
        parameters: {
          type: 'object',
          properties: {
            hashtags: { type: 'array', items: { type: 'string' } },
            platform: { type: 'string' }
          },
          required: ['hashtags', 'platform']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'generate_image_prompt',
        description: 'Generate a prompt for AI image generation',
        parameters: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            style: { type: 'string' }
          },
          required: ['description']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'get_optimal_posting_time',
        description: 'Get optimal posting time for a platform and audience',
        parameters: {
          type: 'object',
          properties: {
            platform: { type: 'string' },
            audience: { type: 'string' }
          },
          required: ['platform']
        }
      }
    }
  ];
}

export function getComplianceTools(): ToolDefinition[] {
  return [
    {
      type: 'function',
      function: {
        name: 'check_brand_guidelines',
        description: 'Check content against brand guidelines',
        parameters: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            brand: { type: 'string' }
          },
          required: ['content', 'brand']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'check_legal_compliance',
        description: 'Check content for legal compliance (FTC, copyright, etc.)',
        parameters: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            region: { type: 'string', description: 'Geographic region for compliance' }
          },
          required: ['content']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'check_platform_policies',
        description: 'Check content against platform-specific policies',
        parameters: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            platform: { type: 'string' }
          },
          required: ['content', 'platform']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'scan_sensitive_content',
        description: 'Scan for potentially sensitive or controversial content',
        parameters: {
          type: 'object',
          properties: {
            content: { type: 'string' }
          },
          required: ['content']
        }
      }
    }
  ];
}

export function getMarketingTools(): ToolDefinition[] {
  return [
    {
      type: 'function',
      function: {
        name: 'create_execution_plan',
        description: 'Create a campaign execution plan with timing and sequence',
        parameters: {
          type: 'object',
          properties: {
            contentPieces: { type: 'array', description: 'Content pieces to schedule' },
            platforms: { type: 'array', items: { type: 'string' } }
          },
          required: ['contentPieces', 'platforms']
        }
      }
    }
  ];
}
