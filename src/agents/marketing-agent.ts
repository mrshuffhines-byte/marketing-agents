import { BaseAgent } from './base-agent';
import { ResearchAgent } from './research-agent';
import { ContentAgent } from './content-agent';
import { ComplianceAgent } from './compliance-agent';
import { getMarketingTools } from '../tools/tool-registry';
import { AgentConfig, AgentResult } from '../lib/types';

export interface CampaignRequest {
  brand: string;
  product: string;
  targetAudience: string;
  platforms: string[];
  campaignGoal: string;
  tone: string;
  constraints?: string[];
}

export interface CampaignResult {
  researchInsights: any;
  contentPieces: any[];
  complianceReport: any;
  executionPlan: any;
}

export class MarketingAgent extends BaseAgent {
  private researchAgent: ResearchAgent;
  private contentAgent: ContentAgent;
  private complianceAgent: ComplianceAgent;

  constructor() {
    const config: AgentConfig = {
      name: 'Marketing Orchestrator',
      description: 'A senior marketing strategist who coordinates research, content creation, and compliance review to produce effective social media campaigns.',
      skillPaths: [
        'skills/marketing/orchestration.md'
      ],
      tools: getMarketingTools()
    };
    super(config);

    this.researchAgent = new ResearchAgent();
    this.contentAgent = new ContentAgent();
    this.complianceAgent = new ComplianceAgent();
  }

  async run(request: CampaignRequest): Promise<AgentResult> {
    try {
      this.progressTracker.start('Starting campaign generation');
      const allToolCalls: string[] = [];

      // Phase 1: Research
      this.progressTracker.update('Phase 1/4: Conducting market research...', 10);
      const researchResult = await this.researchAgent.run({
        brand: request.brand,
        product: request.product,
        targetAudience: request.targetAudience,
        platforms: request.platforms
      });

      if (!researchResult.success) {
        return {
          success: false,
          output: null,
          toolCallsExecuted: researchResult.toolCallsExecuted,
          error: `Research phase failed: ${researchResult.error}`
        };
      }
      allToolCalls.push(...researchResult.toolCallsExecuted);

      // Parse research output
      let researchInsights;
      try {
        researchInsights = JSON.parse(researchResult.output);
      } catch {
        researchInsights = { rawInsights: researchResult.output };
      }

      // Phase 2: Content Creation
      this.progressTracker.update('Phase 2/4: Creating content...', 35);
      const contentResult = await this.contentAgent.run({
        brand: request.brand,
        product: request.product,
        targetAudience: request.targetAudience,
        platforms: request.platforms,
        tone: request.tone,
        campaignGoal: request.campaignGoal,
        researchInsights
      });

      if (!contentResult.success) {
        return {
          success: false,
          output: null,
          toolCallsExecuted: [...allToolCalls, ...contentResult.toolCallsExecuted],
          error: `Content creation phase failed: ${contentResult.error}`
        };
      }
      allToolCalls.push(...contentResult.toolCallsExecuted);

      // Parse content output
      let contentPieces;
      try {
        contentPieces = JSON.parse(contentResult.output);
      } catch {
        contentPieces = [{ rawContent: contentResult.output }];
      }

      // Phase 3: Compliance Review
      this.progressTracker.update('Phase 3/4: Reviewing compliance...', 60);
      const complianceResult = await this.complianceAgent.run({
        brand: request.brand,
        contentPieces,
        platforms: request.platforms,
        constraints: request.constraints
      });

      allToolCalls.push(...complianceResult.toolCallsExecuted);

      // Parse compliance output
      let complianceOutput;
      try {
        complianceOutput = JSON.parse(complianceResult.output);
      } catch {
        complianceOutput = {
          contentPieces,
          report: { overallStatus: 'needs_revision', rawOutput: complianceResult.output }
        };
      }

      // Phase 4: Assembly
      this.progressTracker.update('Phase 4/4: Assembling final campaign...', 85);
      const executionPlan = this.createExecutionPlan(
        complianceOutput.contentPieces || contentPieces,
        request.platforms
      );

      const finalCampaign: CampaignResult = {
        researchInsights,
        contentPieces: complianceOutput.contentPieces || contentPieces,
        complianceReport: complianceOutput.report,
        executionPlan
      };

      this.progressTracker.complete('Campaign generation complete');

      return {
        success: true,
        output: finalCampaign,
        toolCallsExecuted: allToolCalls
      };
    } catch (error) {
      this.progressTracker.error('Campaign generation failed');
      return {
        success: false,
        output: null,
        toolCallsExecuted: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private createExecutionPlan(contentPieces: any[], platforms: string[]): any {
    const scheduledPosts = contentPieces.map((piece, index) => ({
      platform: piece.platform || platforms[index % platforms.length],
      contentIndex: index,
      suggestedDateTime: piece.bestPostingTime || '11:00 AM',
      timezone: 'EST',
      priority: index + 1
    }));

    return {
      scheduledPosts,
      recommendations: [
        'Post content in the suggested order for maximum impact',
        'Monitor engagement in the first hour and respond to comments',
        'Consider boosting top-performing posts',
        'Track performance metrics after 24-48 hours'
      ],
      campaignDuration: '1 week'
    };
  }

  protected async executeToolCall(
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    switch (toolName) {
      case 'create_execution_plan':
        return this.createExecutionPlan(args.contentPieces, args.platforms);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  }
}
