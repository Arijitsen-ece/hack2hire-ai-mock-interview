import { ResumeData, ExtractedSkill } from './types';

// Technical skills database with weights
const TECHNICAL_SKILLS: Record<string, number> = {
  // Programming Languages
  'javascript': 3, 'typescript': 3, 'python': 3, 'java': 3, 'c++': 3, 'c#': 3,
  'go': 3, 'rust': 3, 'ruby': 2, 'php': 2, 'swift': 3, 'kotlin': 3,
  'scala': 2, 'r': 2, 'matlab': 2,
  
  // Frontend
  'react': 3, 'angular': 3, 'vue': 3, 'svelte': 2, 'nextjs': 3, 'next.js': 3,
  'html': 2, 'css': 2, 'sass': 2, 'tailwind': 2, 'bootstrap': 1,
  'redux': 2, 'graphql': 2, 'webpack': 2,
  
  // Backend
  'node': 3, 'nodejs': 3, 'express': 2, 'fastapi': 2, 'django': 3, 'flask': 2,
  'spring': 3, 'spring boot': 3, 'asp.net': 2, 'rails': 2,
  
  // Databases
  'sql': 3, 'mysql': 2, 'postgresql': 3, 'mongodb': 3, 'redis': 2,
  'elasticsearch': 2, 'dynamodb': 2, 'firebase': 2, 'supabase': 2,
  
  // Cloud & DevOps
  'aws': 3, 'azure': 3, 'gcp': 3, 'docker': 3, 'kubernetes': 3, 'k8s': 3,
  'terraform': 2, 'ansible': 2, 'jenkins': 2, 'ci/cd': 2, 'github actions': 2,
  
  // Data & ML
  'machine learning': 3, 'deep learning': 3, 'tensorflow': 3, 'pytorch': 3,
  'pandas': 2, 'numpy': 2, 'scikit-learn': 2, 'nlp': 2, 'computer vision': 2,
  
  // Other
  'git': 2, 'agile': 1, 'scrum': 1, 'rest': 2, 'api': 2, 'microservices': 2,
  'linux': 2, 'testing': 2, 'tdd': 2, 'system design': 3,
};

const SOFT_SKILLS: Record<string, number> = {
  'leadership': 2, 'communication': 2, 'teamwork': 2, 'problem solving': 2,
  'critical thinking': 2, 'time management': 1, 'adaptability': 1,
  'collaboration': 1, 'mentoring': 2, 'presentation': 1,
};

const DOMAIN_KEYWORDS: Record<string, number> = {
  'fintech': 2, 'healthcare': 2, 'ecommerce': 2, 'e-commerce': 2,
  'saas': 2, 'b2b': 1, 'b2c': 1, 'startup': 1, 'enterprise': 1,
  'mobile': 2, 'web': 1, 'full stack': 2, 'fullstack': 2, 'frontend': 2, 'backend': 2,
};

const ROLE_KEYWORDS = [
  'software engineer', 'developer', 'architect', 'lead', 'senior', 'junior',
  'manager', 'tech lead', 'principal', 'staff', 'intern', 'consultant',
  'data scientist', 'ml engineer', 'devops', 'sre', 'qa', 'analyst',
];

function extractYearsOfExperience(text: string): number {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /experience[:\s]+(\d+)\s*years?/gi,
    /(\d+)\s*years?\s*in\s*(?:the\s*)?(?:industry|field|software)/gi,
  ];
  
  let maxYears = 0;
  
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const years = parseInt(match[1]);
      if (years > maxYears && years <= 50) {
        maxYears = years;
      }
    }
  }
  
  return maxYears;
}

function extractProjects(text: string): string[] {
  const projects: string[] = [];
  const lines = text.split('\n');
  
  let inProjectSection = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('project') || lowerLine.includes('portfolio')) {
      inProjectSection = true;
      continue;
    }
    
    if (inProjectSection && line.trim().length > 10 && line.trim().length < 100) {
      if (line.includes('-') || line.includes('•') || line.includes(':')) {
        const projectName = line.replace(/^[\s\-•:]+/, '').trim();
        if (projectName.length > 5) {
          projects.push(projectName);
        }
      }
    }
    
    if (inProjectSection && (lowerLine.includes('education') || lowerLine.includes('certification'))) {
      inProjectSection = false;
    }
  }
  
  return projects.slice(0, 5);
}

function findSkills(text: string, skillDb: Record<string, number>, category: 'technical' | 'soft' | 'domain'): ExtractedSkill[] {
  const lowerText = text.toLowerCase();
  const foundSkills: ExtractedSkill[] = [];
  
  for (const [skill, weight] of Object.entries(skillDb)) {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(lowerText)) {
      foundSkills.push({ name: skill, weight, category });
    }
  }
  
  return foundSkills;
}

function findRoleKeywords(text: string): string[] {
  const lowerText = text.toLowerCase();
  return ROLE_KEYWORDS.filter(role => lowerText.includes(role));
}

export function parseResume(resumeText: string): ResumeData {
  const technicalSkills = findSkills(resumeText, TECHNICAL_SKILLS, 'technical');
  const softSkills = findSkills(resumeText, SOFT_SKILLS, 'soft');
  const domainSkills = findSkills(resumeText, DOMAIN_KEYWORDS, 'domain');
  
  return {
    skills: [...technicalSkills, ...softSkills, ...domainSkills],
    yearsOfExperience: extractYearsOfExperience(resumeText),
    projects: extractProjects(resumeText),
    roleKeywords: findRoleKeywords(resumeText),
    rawText: resumeText,
  };
}
