import * as fs from 'fs';
import * as path from 'path';

const skillCache = new Map<string, string>();

export function loadSkill(skillPath: string): string {
  if (skillCache.has(skillPath)) {
    return skillCache.get(skillPath)!;
  }

  const fullPath = path.resolve(process.cwd(), 'src', skillPath);

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    skillCache.set(skillPath, content);
    return content;
  } catch (error) {
    console.warn(`Warning: Could not load skill file: ${skillPath}`);
    return '';
  }
}

export function loadSkills(skillPaths: string[]): string {
  return skillPaths
    .map(skillPath => {
      const content = loadSkill(skillPath);
      if (content) {
        const filename = path.basename(skillPath, '.md');
        const title = filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `### ${title}\n\n${content}`;
      }
      return '';
    })
    .filter(content => content.length > 0)
    .join('\n\n---\n\n');
}

export function clearSkillCache(): void {
  skillCache.clear();
}
