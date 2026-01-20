// Campaign Request/Response types
export interface CampaignRequest {
  brand: string;
  product: string;
  targetAudience: string;
  platforms: Platform[];
  campaignGoal: string;
  tone: Tone;
  constraints?: string[];
}

export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'facebook';
export type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

export interface ContentPiece {
  platform: string;
  postText: string;
  caption?: string;
  hashtags: string[];
  suggestedImageDescription?: string;
  bestPostingTime?: string;
  complianceStatus: 'approved' | 'needs_revision' | 'rejected';
  complianceNotes?: string[];
}

export interface CampaignResult {
  id: string;
  createdAt: Date;
  request: CampaignRequest;
  researchInsights: ResearchInsights;
  contentPieces: ContentPiece[];
  complianceReport: ComplianceReport;
  executionPlan: ExecutionPlan;
}

export interface ResearchInsights {
  marketTrends: string[];
  competitorAnalysis: Record<string, any>;
  audienceInsights: Record<string, any>;
  trendingHashtags: string[];
  platformRecommendations: Record<string, any>;
}

export interface ComplianceReport {
  overallStatus: 'approved' | 'needs_revision' | 'rejected';
  brandGuidelineCompliance: boolean;
  legalCompliance: boolean;
  platformPolicyCompliance: boolean;
  accessibilityScore: number;
  issues: ComplianceIssue[];
}

export interface ComplianceIssue {
  contentPieceIndex: number;
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  suggestion?: string;
}

export interface ExecutionPlan {
  scheduledPosts: ScheduledPost[];
  recommendations: string[];
  estimatedReach?: string;
  campaignDuration: string;
}

export interface ScheduledPost {
  platform: string;
  contentIndex: number;
  suggestedDateTime: string;
  timezone: string;
  priority: number;
}

// Agent types
export interface AgentConfig {
  name: string;
  description: string;
  skillPaths: string[];
  tools: ToolDefinition[];
}

export interface AgentResult {
  success: boolean;
  output: any;
  toolCallsExecuted: string[];
  reasoning?: string;
  error?: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface OpenAIResponse {
  content: string | null;
  toolCalls?: ToolCall[];
  finishReason: string;
}

export interface ProgressUpdate {
  status: 'started' | 'in_progress' | 'completed' | 'error';
  message: string;
  progress?: number;
  timestamp: Date;
  details?: any;
}
