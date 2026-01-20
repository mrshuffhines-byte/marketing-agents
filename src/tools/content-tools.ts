/**
 * Content creation tools for the Content Agent
 */

const platformLimits: Record<string, number> = {
  twitter: 280,
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
  facebook: 63206
};

export async function checkCharacterCount(
  text: string,
  platform: string
): Promise<{ isValid: boolean; count: number; limit: number; suggestion?: string }> {
  const limit = platformLimits[platform] || 2200;
  const count = text.length;
  const isValid = count <= limit;

  return {
    isValid,
    count,
    limit,
    suggestion: isValid
      ? undefined
      : `Text is ${count - limit} characters over the limit. Consider shortening.`
  };
}

export async function optimizeHashtags(
  hashtags: string[],
  platform: string
): Promise<{ optimized: string[]; recommendations: string[] }> {
  const optimalCounts: Record<string, number> = {
    instagram: 10,
    twitter: 2,
    linkedin: 5,
    tiktok: 5
  };

  const optimal = optimalCounts[platform] || 5;
  const optimized = hashtags.slice(0, optimal);
  const recommendations: string[] = [];

  if (hashtags.length > optimal) {
    recommendations.push(`Reduced from ${hashtags.length} to ${optimal} hashtags for ${platform}`);
  }

  const formattedHashtags = optimized.map(tag =>
    tag.startsWith('#') ? tag : `#${tag}`
  );

  return {
    optimized: formattedHashtags,
    recommendations
  };
}

export async function generateImagePrompt(
  description: string,
  style?: string
): Promise<{ prompt: string; negativePrompt: string }> {
  const styleModifiers: Record<string, string> = {
    professional: 'clean, corporate, high-quality, professional lighting, modern',
    casual: 'friendly, warm, natural lighting, lifestyle, authentic',
    minimalist: 'simple, clean background, modern, sleek, white space',
    bold: 'vibrant colors, dynamic composition, eye-catching, energetic'
  };

  const modifier = styleModifiers[style || 'professional'];

  return {
    prompt: `${description}, ${modifier}, 4K quality, social media optimized, high resolution`,
    negativePrompt: 'blurry, low quality, text, watermark, distorted, amateur'
  };
}

export async function getOptimalPostingTime(
  platform: string,
  audience?: string
): Promise<{ times: string[]; timezone: string; reasoning: string }> {
  const timings: Record<string, string[]> = {
    instagram: ['11:00 AM', '1:00 PM', '7:00 PM'],
    twitter: ['8:00 AM', '12:00 PM', '5:00 PM'],
    linkedin: ['7:30 AM', '12:00 PM', '5:30 PM'],
    tiktok: ['7:00 AM', '12:00 PM', '9:00 PM']
  };

  return {
    times: timings[platform] || timings.instagram,
    timezone: 'EST',
    reasoning: `Based on ${platform} engagement patterns for ${audience || 'general audience'}. These times typically see highest engagement and reach.`
  };
}
