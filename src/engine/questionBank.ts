import { Question, Difficulty, QuestionType } from './types';

// Comprehensive question bank organized by skill and difficulty
const QUESTION_BANK: Record<string, Question[]> = {
  // JavaScript/TypeScript
  javascript: [
    {
      id: 'js-easy-1',
      text: 'Explain the difference between let, const, and var in JavaScript.',
      type: 'CONCEPTUAL',
      difficulty: 'EASY',
      expectedKeywords: ['scope', 'hoisting', 'block', 'function', 'reassign', 'const', 'immutable'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'javascript',
    },
    {
      id: 'js-easy-2',
      text: 'What is the purpose of the Array.map() method? Provide an example use case.',
      type: 'TECHNICAL',
      difficulty: 'EASY',
      expectedKeywords: ['transform', 'array', 'callback', 'return', 'new array', 'element'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'javascript',
    },
    {
      id: 'js-medium-1',
      text: 'Explain closures in JavaScript and provide a practical example of when you would use one.',
      type: 'CONCEPTUAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['function', 'scope', 'outer', 'inner', 'access', 'variable', 'lexical', 'encapsulation'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'javascript',
    },
    {
      id: 'js-medium-2',
      text: 'How does the JavaScript event loop work? Explain the relationship between the call stack, callback queue, and microtask queue.',
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['call stack', 'callback', 'queue', 'async', 'promise', 'microtask', 'setTimeout', 'execution'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'javascript',
    },
    {
      id: 'js-hard-1',
      text: 'Design and implement a debounce function from scratch. Explain your implementation choices.',
      type: 'TECHNICAL',
      difficulty: 'HARD',
      expectedKeywords: ['timeout', 'clear', 'delay', 'function', 'performance', 'closure', 'arguments', 'this'],
      timeLimit: 180,
      maxScore: 25,
      skillTested: 'javascript',
    },
  ],
  
  // React
  react: [
    {
      id: 'react-easy-1',
      text: 'What are React hooks? Name three commonly used hooks and their purposes.',
      type: 'CONCEPTUAL',
      difficulty: 'EASY',
      expectedKeywords: ['useState', 'useEffect', 'functional', 'component', 'state', 'lifecycle', 'side effect'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'react',
    },
    {
      id: 'react-medium-1',
      text: 'Explain the concept of lifting state up in React. When and why would you do this?',
      type: 'CONCEPTUAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['parent', 'child', 'shared', 'prop', 'callback', 'single source', 'truth'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'react',
    },
    {
      id: 'react-medium-2',
      text: 'What is the purpose of useMemo and useCallback? When should you use each?',
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['memoization', 'performance', 'reference', 'dependency', 'expensive', 'computation', 'rerender'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'react',
    },
    {
      id: 'react-hard-1',
      text: 'Design a custom hook for handling form validation with support for async validation rules. Explain your approach.',
      type: 'SCENARIO',
      difficulty: 'HARD',
      expectedKeywords: ['custom hook', 'state', 'validation', 'async', 'error', 'touched', 'submit', 'reusable'],
      timeLimit: 180,
      maxScore: 25,
      skillTested: 'react',
    },
  ],
  
  // Python
  python: [
    {
      id: 'py-easy-1',
      text: 'What is the difference between a list and a tuple in Python?',
      type: 'CONCEPTUAL',
      difficulty: 'EASY',
      expectedKeywords: ['mutable', 'immutable', 'bracket', 'parentheses', 'modify', 'performance'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'python',
    },
    {
      id: 'py-medium-1',
      text: 'Explain Python decorators and provide an example of a practical use case.',
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['function', 'wrapper', '@', 'modify', 'behavior', 'logging', 'authentication'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'python',
    },
    {
      id: 'py-hard-1',
      text: 'How would you implement a context manager in Python? What are the advantages of using one?',
      type: 'TECHNICAL',
      difficulty: 'HARD',
      expectedKeywords: ['__enter__', '__exit__', 'with', 'resource', 'cleanup', 'exception', 'file'],
      timeLimit: 180,
      maxScore: 25,
      skillTested: 'python',
    },
  ],
  
  // SQL/Database
  sql: [
    {
      id: 'sql-easy-1',
      text: 'What is the difference between INNER JOIN and LEFT JOIN?',
      type: 'CONCEPTUAL',
      difficulty: 'EASY',
      expectedKeywords: ['matching', 'rows', 'null', 'all', 'left table', 'intersection'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'sql',
    },
    {
      id: 'sql-medium-1',
      text: 'Explain database indexing. When would you create an index and what are the trade-offs?',
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['performance', 'lookup', 'B-tree', 'write', 'storage', 'query', 'optimization'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'sql',
    },
    {
      id: 'sql-hard-1',
      text: 'Design a database schema for an e-commerce platform. Explain your normalization decisions.',
      type: 'SCENARIO',
      difficulty: 'HARD',
      expectedKeywords: ['table', 'relationship', 'foreign key', 'normalization', 'user', 'product', 'order'],
      timeLimit: 180,
      maxScore: 25,
      skillTested: 'sql',
    },
  ],
  
  // System Design
  'system design': [
    {
      id: 'sd-medium-1',
      text: 'Explain the concept of horizontal vs vertical scaling. When would you choose each?',
      type: 'CONCEPTUAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['server', 'resources', 'load', 'cost', 'availability', 'complexity'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'system design',
    },
    {
      id: 'sd-hard-1',
      text: 'Design a URL shortening service like bit.ly. Discuss the key components and scaling considerations.',
      type: 'SCENARIO',
      difficulty: 'HARD',
      expectedKeywords: ['hash', 'database', 'redirect', 'cache', 'scale', 'unique', 'collision'],
      timeLimit: 180,
      maxScore: 25,
      skillTested: 'system design',
    },
  ],
  
  // API/REST
  api: [
    {
      id: 'api-easy-1',
      text: 'What is REST? Explain the key principles of RESTful API design.',
      type: 'CONCEPTUAL',
      difficulty: 'EASY',
      expectedKeywords: ['stateless', 'resource', 'HTTP', 'method', 'endpoint', 'GET', 'POST'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'api',
    },
    {
      id: 'api-medium-1',
      text: 'How would you handle API versioning? What are the different approaches and their trade-offs?',
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['URL', 'header', 'query', 'backward compatible', 'deprecation', 'client'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'api',
    },
  ],
  
  // Docker/DevOps
  docker: [
    {
      id: 'docker-easy-1',
      text: 'What is Docker and why would you use it in development?',
      type: 'CONCEPTUAL',
      difficulty: 'EASY',
      expectedKeywords: ['container', 'image', 'consistent', 'environment', 'isolation', 'dependency'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'docker',
    },
    {
      id: 'docker-medium-1',
      text: 'Explain the difference between a Docker image and a container. How do layers work in Docker?',
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      expectedKeywords: ['template', 'instance', 'layer', 'cache', 'Dockerfile', 'build'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'docker',
    },
  ],
  
  // General/Soft Skills
  general: [
    {
      id: 'gen-easy-1',
      text: 'Describe a challenging bug you encountered and how you debugged it.',
      type: 'SCENARIO',
      difficulty: 'EASY',
      expectedKeywords: ['identify', 'reproduce', 'investigate', 'fix', 'test', 'root cause'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'problem solving',
    },
    {
      id: 'gen-medium-1',
      text: 'How do you approach learning a new technology or framework quickly?',
      type: 'SCENARIO',
      difficulty: 'MEDIUM',
      expectedKeywords: ['documentation', 'tutorial', 'practice', 'project', 'community', 'hands-on'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'learning',
    },
    {
      id: 'gen-medium-2',
      text: 'Tell me about a time you had to make a difficult technical decision. What was your approach?',
      type: 'SCENARIO',
      difficulty: 'MEDIUM',
      expectedKeywords: ['trade-off', 'stakeholder', 'research', 'decision', 'outcome', 'learn'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'decision making',
    },
  ],
  
  // AWS/Cloud
  aws: [
    {
      id: 'aws-easy-1',
      text: 'What is the difference between EC2 and Lambda in AWS?',
      type: 'CONCEPTUAL',
      difficulty: 'EASY',
      expectedKeywords: ['server', 'serverless', 'instance', 'function', 'scale', 'cost', 'manage'],
      timeLimit: 90,
      maxScore: 25,
      skillTested: 'aws',
    },
    {
      id: 'aws-medium-1',
      text: 'Explain how you would set up a highly available web application on AWS.',
      type: 'SCENARIO',
      difficulty: 'MEDIUM',
      expectedKeywords: ['load balancer', 'auto scaling', 'availability zone', 'RDS', 'S3', 'CloudFront'],
      timeLimit: 120,
      maxScore: 25,
      skillTested: 'aws',
    },
  ],
};

// Fallback questions for skills not in the bank
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'fallback-easy-1',
    text: 'What interests you about this technology/skill area?',
    type: 'SCENARIO',
    difficulty: 'EASY',
    expectedKeywords: ['interest', 'learn', 'project', 'experience', 'goal'],
    timeLimit: 90,
    maxScore: 25,
    skillTested: 'general',
  },
  {
    id: 'fallback-medium-1',
    text: 'Describe a project where you applied problem-solving skills to overcome a technical challenge.',
    type: 'SCENARIO',
    difficulty: 'MEDIUM',
    expectedKeywords: ['challenge', 'solution', 'approach', 'result', 'learn'],
    timeLimit: 120,
    maxScore: 25,
    skillTested: 'problem solving',
  },
  {
    id: 'fallback-hard-1',
    text: 'How would you approach designing a scalable system for a new product feature?',
    type: 'SCENARIO',
    difficulty: 'HARD',
    expectedKeywords: ['requirements', 'architecture', 'scale', 'trade-off', 'maintenance'],
    timeLimit: 180,
    maxScore: 25,
    skillTested: 'system design',
  },
];

export function getQuestionsForSkill(skill: string, difficulty?: Difficulty): Question[] {
  const normalizedSkill = skill.toLowerCase();
  
  // Try exact match first
  if (QUESTION_BANK[normalizedSkill]) {
    const questions = QUESTION_BANK[normalizedSkill];
    if (difficulty) {
      return questions.filter(q => q.difficulty === difficulty);
    }
    return questions;
  }
  
  // Try partial match
  for (const [bankSkill, questions] of Object.entries(QUESTION_BANK)) {
    if (normalizedSkill.includes(bankSkill) || bankSkill.includes(normalizedSkill)) {
      if (difficulty) {
        return questions.filter(q => q.difficulty === difficulty);
      }
      return questions;
    }
  }
  
  // Return fallback questions
  if (difficulty) {
    return FALLBACK_QUESTIONS.filter(q => q.difficulty === difficulty);
  }
  return FALLBACK_QUESTIONS;
}

export function buildQuestionPool(skills: string[], targetCount: number = 10): Question[] {
  const pool: Question[] = [];
  const usedIds = new Set<string>();
  
  // Distribute questions across skills
  const questionsPerSkill = Math.ceil(targetCount / Math.max(skills.length, 1));
  
  for (const skill of skills) {
    const skillQuestions = getQuestionsForSkill(skill);
    
    for (const q of skillQuestions) {
      if (!usedIds.has(q.id) && pool.length < targetCount * 2) {
        pool.push(q);
        usedIds.add(q.id);
      }
      if (pool.filter(p => p.skillTested.toLowerCase() === skill.toLowerCase()).length >= questionsPerSkill) {
        break;
      }
    }
  }
  
  // Add general questions if pool is too small
  for (const q of QUESTION_BANK.general || []) {
    if (!usedIds.has(q.id) && pool.length < targetCount) {
      pool.push(q);
      usedIds.add(q.id);
    }
  }
  
  // Add fallbacks if still too small
  for (const q of FALLBACK_QUESTIONS) {
    if (!usedIds.has(q.id) && pool.length < targetCount) {
      pool.push(q);
      usedIds.add(q.id);
    }
  }
  
  return pool;
}

export function getNextQuestion(
  pool: Question[],
  usedQuestionIds: Set<string>,
  targetDifficulty: Difficulty
): Question | null {
  // First try to find a question at the target difficulty
  const targetQuestions = pool.filter(
    q => q.difficulty === targetDifficulty && !usedQuestionIds.has(q.id)
  );
  
  if (targetQuestions.length > 0) {
    return targetQuestions[Math.floor(Math.random() * targetQuestions.length)];
  }
  
  // Fall back to any available question
  const availableQuestions = pool.filter(q => !usedQuestionIds.has(q.id));
  
  if (availableQuestions.length > 0) {
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }
  
  return null;
}
