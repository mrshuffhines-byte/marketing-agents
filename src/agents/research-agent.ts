import { BaseAgent } from './base-agent';
import { getResearchTools } from '../tools/tool-registry';
import * as researchTools from '../tools/research-tools';
import { AgentConfig, AgentResult } from '../lib/types';

export interface ResearchRequest {
  brand: string;
  product: string;
  targetAudience: string;
  platforms: string[];
}

export class ResearchAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Market Research Specialist',
      description: 'An expert market researcher who analyzes trends, competitors, and audience insights to inform content strategy.',
      skillPaths: [
        'skills/research/market-analysis.md'
      ],
      tools: getResearchTools()
    };
    super(config);
  }

  async run(request: ResearchRequest): Promise<AgentResult> {
    const researchPrompt = `Conduct comprehensive market research for a social media campaign.

Brand: ${request.brand}
Product: ${request.product}
Target Audience: ${request.targetAudience}
Platforms: ${request.platforms.join(', ')}

Perform the following research tasks:
1. Analyze current market trends relevant to this product
2. Research competitor social media strategies
3. Gather audience insights and preferences
4. Identify trending hashtags and topics
5. Note platform-specific engagement patterns

Use your tools to gather data. Compile your findings into a structured JSON research report with the following structure:
{
  "marketTrends": [],
  "competitorAnalysis": {},
  "audienceInsights": {},
  "trendingHashtags": [],
  "platformRecommendations": {}
}`;

    return this.executeWithTools(researchPrompt);
  }

  protected async executeToolCall(
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    switch (toolName) {
      case 'search_market_trends':
        return researchTools.searchMarketTrends(args.query, args.industry);
      case 'analyze_competitors':
        return researchTools.analyzeCompetitors(args.competitors, args.platform);
      case 'get_trending_hashtags':
        return researchTools.getTrendingHashtags(args.platform, args.category);
      case 'analyze_audience_demographics':
        return researchTools.analyzeAudienceDemographics(args.targetAudience);
      case 'get_platform_insights':
        return researchTools.getPlatformInsights(args.platform);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  }
}
