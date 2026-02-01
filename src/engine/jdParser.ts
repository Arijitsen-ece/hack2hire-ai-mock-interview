import { JDData, ExtractedSkill } from './types';

// Skill categories for JD parsing
const REQUIRED_PATTERNS = [
  /required\s*(?:skills?|qualifications?|experience)/i,
  /must\s*have/i,
  /essential/i,
  /minimum\s*requirements?/i,
];

const PREFERRED_PATTERNS = [
  /preferred\s*(?:skills?|qualifications?)/i,
  /nice\s*to\s*have/i,
  /bonus/i,
  /plus/i,
  /desired/i,
];

const SKILL_DATABASE: Record<string, { category: 'technical' | 'soft' | 'domain'; weight: number }> = {
  // Technical
  'javascript': { category: 'technical', weight: 3 },
  'typescript': { category: 'technical', weight: 3 },
  'python': { category: 'technical', weight: 3 },
  'java': { category: 'technical', weight: 3 },
  'react': { category: 'technical', weight: 3 },
  'angular': { category: 'technical', weight: 3 },
  'vue': { category: 'technical', weight: 3 },
  'node': { category: 'technical', weight: 3 },
  'nodejs': { category: 'technical', weight: 3 },
  'sql': { category: 'technical', weight: 3 },
  'nosql': { category: 'technical', weight: 2 },
  'mongodb': { category: 'technical', weight: 2 },
  'postgresql': { category: 'technical', weight: 3 },
  'aws': { category: 'technical', weight: 3 },
  'azure': { category: 'technical', weight: 3 },
  'gcp': { category: 'technical', weight: 3 },
  'docker': { category: 'technical', weight: 3 },
  'kubernetes': { category: 'technical', weight: 3 },
  'git': { category: 'technical', weight: 2 },
  'ci/cd': { category: 'technical', weight: 2 },
  'rest': { category: 'technical', weight: 2 },
  'api': { category: 'technical', weight: 2 },
  'microservices': { category: 'technical', weight: 2 },
  'agile': { category: 'soft', weight: 1 },
  'scrum': { category: 'soft', weight: 1 },
  'machine learning': { category: 'technical', weight: 3 },
  'data analysis': { category: 'technical', weight: 2 },
  'system design': { category: 'technical', weight: 3 },
  // Soft skills
  'communication': { category: 'soft', weight: 2 },
  'leadership': { category: 'soft', weight: 2 },
  'teamwork': { category: 'soft', weight: 2 },
  'problem solving': { category: 'soft', weight: 2 },
};

function extractRoleTitle(text: string): string {
  const lines = text.split('\n');
  
  // Look for common role title patterns
  const titlePatterns = [
    /(?:job\s*title|position|role)[:\s]+(.+)/i,
    /^((?:senior|junior|lead|staff|principal)?\s*(?:software|frontend|backend|fullstack|full-stack|data|ml|devops)\s*(?:engineer|developer|architect|scientist))/im,
  ];
  
  for (const line of lines.slice(0, 5)) {
    for (const pattern of titlePatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  }
  
  // Fallback: use first non-empty line
  for (const line of lines) {
    if (line.trim().length > 5 && line.trim().length < 60) {
      return line.trim();
    }
  }
  
  return 'Software Engineer';
}

function extractExperienceRequired(text: string): number {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /minimum\s*(\d+)\s*years?/gi,
    /at\s*least\s*(\d+)\s*years?/gi,
  ];
  
  let minYears = 0;
  
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const years = parseInt(match[1]);
      if (years > minYears && years <= 20) {
        minYears = years;
      }
    }
  }
  
  return minYears;
}

function extractSkillsFromText(text: string): { required: ExtractedSkill[]; preferred: ExtractedSkill[] } {
  const lowerText = text.toLowerCase();
  const required: ExtractedSkill[] = [];
  const preferred: ExtractedSkill[] = [];
  
  // Split text into sections
  const sections = text.split(/\n{2,}/);
  let currentSection: 'required' | 'preferred' | 'unknown' = 'unknown';
  
  for (const section of sections) {
    const lowerSection = section.toLowerCase();
    
    // Determine section type
    if (REQUIRED_PATTERNS.some(p => p.test(lowerSection))) {
      currentSection = 'required';
    } else if (PREFERRED_PATTERNS.some(p => p.test(lowerSection))) {
      currentSection = 'preferred';
    }
    
    // Extract skills from section
    for (const [skillName, skillInfo] of Object.entries(SKILL_DATABASE)) {
      const pattern = new RegExp(`\\b${skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(section)) {
        const skill: ExtractedSkill = {
          name: skillName,
          weight: skillInfo.weight,
          category: skillInfo.category,
        };
        
        if (currentSection === 'preferred') {
          if (!preferred.find(s => s.name === skillName)) {
            preferred.push(skill);
          }
        } else {
          if (!required.find(s => s.name === skillName)) {
            required.push(skill);
          }
        }
      }
    }
  }
  
  // If no clear sections, treat all found skills as required
  if (required.length === 0 && preferred.length === 0) {
    for (const [skillName, skillInfo] of Object.entries(SKILL_DATABASE)) {
      const pattern = new RegExp(`\\b${skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(lowerText)) {
        required.push({
          name: skillName,
          weight: skillInfo.weight,
          category: skillInfo.category,
        });
      }
    }
  }
  
  return { required, preferred };
}

export function parseJD(jdText: string): JDData {
  const { required, preferred } = extractSkillsFromText(jdText);
  
  return {
    requiredSkills: required,
    preferredSkills: preferred,
    roleTitle: extractRoleTitle(jdText),
    experienceRequired: extractExperienceRequired(jdText),
    rawText: jdText,
  };
}
