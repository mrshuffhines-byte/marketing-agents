import { BaseAgent } from './base-agent';
import { getComplianceTools } from '../tools/tool-registry';
import * as complianceTools from '../tools/compliance-tools';
import { AgentConfig, AgentResult } from '../lib/types';

export interface ComplianceRequest {
  brand: string;
  contentPieces: any[];
  platforms: string[];
  constraints?: string[];
}

export class ComplianceAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Compliance Reviewer',
      description: 'A meticulous compliance specialist who reviews content for brand guideline adherence, legal requirements, and platform policy compliance.',
      skillPaths: [
        'skills/compliance/brand-guidelines.md'
      ],
      tools: getComplianceTools()
    };
    super(config);
  }

  async run(request: ComplianceRequest): Promise<AgentResult> {
    const compliancePrompt = `Review the following content for compliance.

Brand: ${request.brand}
Platforms: ${request.platforms.join(', ')}
${request.constraints ? `Additional Constraints: ${request.constraints.join(', ')}` : ''}

Content to Review:
${JSON.stringify(request.contentPieces, null, 2)}

For each content piece, check:
1. Brand voice and guideline compliance
2. Legal requirements (FTC disclosures, copyright, etc.)
3. Platform-specific policy compliance
4. Sensitive content or potential issues

Use your tools to verify compliance. Return a JSON object:
{
  "contentPieces": [
    {
      "platform": "platform_name",
      "postText": "original or revised text",
      "hashtags": ["hashtags"],
      "complianceStatus": "approved|needs_revision|rejected",
      "complianceNotes": ["any issues or notes"]
    }
  ],
  "report": {
    "overallStatus": "approved|needs_revision|rejected",
    "brandGuidelineCompliance": true/false,
    "legalCompliance": true/false,
    "platformPolicyCompliance": true/false,
    "issues": []
  }
}`;

    return this.executeWithTools(compliancePrompt);
  }

  protected async executeToolCall(
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    switch (toolName) {
      case 'check_brand_guidelines':
        return complianceTools.checkBrandGuidelines(args.content, args.brand);
      case 'check_legal_compliance':
        return complianceTools.checkLegalCompliance(args.content, args.region);
      case 'check_platform_policies':
        return complianceTools.checkPlatformPolicies(args.content, args.platform);
      case 'scan_sensitive_content':
        return complianceTools.scanSensitiveContent(args.content);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  }
}
