/**
 * Compliance checking tools for the Compliance Agent
 */

export async function checkBrandGuidelines(
  content: string,
  brand: string
): Promise<{ isCompliant: boolean; issues: string[]; suggestions: string[] }> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for common brand guideline issues
  if (content.includes('!!!') || content.includes('????')) {
    issues.push('Excessive punctuation may not align with professional brand voice');
    suggestions.push('Reduce excessive punctuation marks');
  }

  if (content.toUpperCase() === content && content.length > 10) {
    issues.push('ALL CAPS text may appear aggressive');
    suggestions.push('Use title case or sentence case instead');
  }

  // Check for emoji overuse
  const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount > 5) {
    issues.push('High emoji count may dilute professional brand voice');
    suggestions.push('Limit emojis to 2-3 per post for professional brands');
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    suggestions
  };
}

export async function checkLegalCompliance(
  content: string,
  region?: string
): Promise<{ isCompliant: boolean; issues: string[]; requiredDisclosures: string[] }> {
  const issues: string[] = [];
  const requiredDisclosures: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for FTC disclosure requirements
  const sponsoredIndicators = ['partner', 'sponsor', 'collab', 'gifted', 'paid'];
  const hasDisclosure = lowerContent.includes('#ad') ||
    lowerContent.includes('#sponsored') ||
    lowerContent.includes('paid partnership');

  const needsDisclosure = sponsoredIndicators.some(ind => lowerContent.includes(ind));

  if (needsDisclosure && !hasDisclosure) {
    issues.push('Content appears to be sponsored but lacks proper disclosure');
    requiredDisclosures.push('#ad or #sponsored disclosure required');
  }

  // Check for claims that need substantiation
  const claimWords = ['proven', 'guaranteed', 'best', 'number one', '#1', 'fastest', 'only'];
  const hasClaims = claimWords.some(word => lowerContent.includes(word));

  if (hasClaims) {
    issues.push('Content contains claims that may require substantiation');
    requiredDisclosures.push('Ensure all claims can be verified with evidence');
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    requiredDisclosures
  };
}

export async function checkPlatformPolicies(
  content: string,
  platform: string
): Promise<{ isCompliant: boolean; issues: string[]; platformSpecific: string[] }> {
  const issues: string[] = [];
  const platformSpecific: string[] = [];
  const lowerContent = content.toLowerCase();

  // Platform-specific checks
  const policies: Record<string, { forbidden: string[]; notes: string[] }> = {
    instagram: {
      forbidden: ['click link in bio', 'follow for follow', 'f4f', 'like for like'],
      notes: ['Avoid engagement bait', 'Ensure proper music licensing for Reels']
    },
    linkedin: {
      forbidden: ['dm me', 'send me a message for more'],
      notes: ['Keep content professional', 'Avoid excessive self-promotion']
    },
    tiktok: {
      forbidden: ['follow for follow', 'like for like', 'duet chain'],
      notes: ['Ensure music is commercially licensed', 'Disclose brand partnerships clearly']
    },
    twitter: {
      forbidden: ['follow back', 'f4f', 'retweet to win'],
      notes: ['Avoid excessive @mentions', 'Disclose automated posting']
    }
  };

  const platformPolicy = policies[platform] || policies.instagram;

  platformPolicy.forbidden.forEach(phrase => {
    if (lowerContent.includes(phrase)) {
      issues.push(`Contains potentially policy-violating phrase: "${phrase}"`);
    }
  });

  return {
    isCompliant: issues.length === 0,
    issues,
    platformSpecific: platformPolicy.notes
  };
}

export async function scanSensitiveContent(
  content: string
): Promise<{ hasSensitiveContent: boolean; categories: string[]; riskLevel: string }> {
  const categories: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for potentially sensitive topics
  const sensitiveTopics: Record<string, string[]> = {
    political: ['election', 'vote', 'political', 'democrat', 'republican', 'liberal', 'conservative'],
    health: ['cure', 'treatment', 'medical', 'diagnosis', 'symptom', 'disease'],
    financial: ['investment', 'guarantee returns', 'get rich', 'crypto investment', 'financial advice'],
    controversial: ['controversial', 'debate', 'divided', 'polarizing']
  };

  Object.entries(sensitiveTopics).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      categories.push(category);
    }
  });

  const riskLevel = categories.length === 0 ? 'low' :
    categories.length === 1 ? 'medium' : 'high';

  return {
    hasSensitiveContent: categories.length > 0,
    categories,
    riskLevel
  };
}
