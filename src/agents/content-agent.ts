import { BaseAgent } from './base-agent';
import { getContentTools } from '../tools/tool-registry';
import * as contentTools from '../tools/content-tools';
import { AgentConfig, AgentResult } from '../lib/types';

export interface ContentRequest {
  brand: string;
  product: string;
  targetAudience: string;
  platforms: string[];
  tone: string;
  campaignGoal: string;
  researchInsights: any;
}

export class ContentAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Content Creator',
      description: 'A creative content specialist who crafts engaging social media posts, captions, and hashtag strategies tailored to each platform.',
      skillPaths: [
        'skills/content/social-media.md'
      ],
      tools: getContentTools()
    };
    super(config);
  }

  async run(request: ContentRequest): Promise<AgentResult> {
    const contentPrompt = `Create social media content for a marketing campaign.

Brand: ${request.brand}
Product: ${request.product}
Target Audience: ${request.targetAudience}
Campaign Goal: ${request.campaignGoal}
Tone: ${request.tone}
Platforms: ${request.platforms.join(', ')}

Research Insights:
${JSON.stringify(request.researchInsights, null, 2)}

For each platform, create content and return as a JSON array:
[
  {
    "platform": "platform_name",
    "postText": "The main post text",
    "caption": "Additional caption if needed",
    "hashtags": ["hashtag1", "hashtag2"],
    "suggestedImageDescription": "Description for visual content",
    "bestPostingTime": "Optimal posting time"
  }
]

Use your tools to:
1. Check character counts for each platform
2. Optimize hashtags for reach
3. Get optimal posting times

Ensure each piece of content is platform-specific and engaging.`;

    return this.executeWithTools(contentPrompt);
  }

  protected async executeToolCall(
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    switch (toolName) {
      case 'check_character_count':
        return contentTools.checkCharacterCount(args.text, args.platform);
      case 'optimize_hashtags':
        return contentTools.optimizeHashtags(args.hashtags, args.platform);
      case 'generate_image_prompt':
        return contentTools.generateImagePrompt(args.description, args.style);
      case 'get_optimal_posting_time':
        return contentTools.getOptimalPostingTime(args.platform, args.audience);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  }
}
