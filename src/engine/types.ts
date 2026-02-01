// Interview State Machine Types

export type InterviewState = 
  | 'INIT'
  | 'RESUME_ANALYSIS'
  | 'JD_ANALYSIS'
  | 'QUESTIONING'
  | 'SCORING'
  | 'EARLY_TERMINATION'
  | 'FINAL_EVALUATION'
  | 'END';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuestionType = 'TECHNICAL' | 'CONCEPTUAL' | 'SCENARIO';

export interface ExtractedSkill {
  name: string;
  weight: number;
  category: 'technical' | 'soft' | 'domain';
}

export interface ResumeData {
  skills: ExtractedSkill[];
  yearsOfExperience: number;
  projects: string[];
  roleKeywords: string[];
  rawText: string;
}

export interface JDData {
  requiredSkills: ExtractedSkill[];
  preferredSkills: ExtractedSkill[];
  roleTitle: string;
  experienceRequired: number;
  rawText: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  expectedKeywords: string[];
  timeLimit: number; // seconds
  maxScore: 25;
  skillTested: string;
}

export interface AnswerScore {
  accuracy: number; // 0-5
  clarity: number; // 0-5
  depth: number; // 0-5
  relevance: number; // 0-5
  timeEfficiency: number; // 0-5
  total: number; // 0-25
  feedback: string;
}

export interface AnswerRecord {
  questionId: string;
  answer: string;
  timeTaken: number;
  score: AnswerScore;
  difficulty: Difficulty;
}

export interface SkillPerformance {
  skill: string;
  questionsAttempted: number;
  averageScore: number;
  strength: boolean;
}

export interface InterviewResult {
  finalScore: number; // 0-100
  level: 'Strong' | 'Average' | 'Needs Improvement';
  skillBreakdown: SkillPerformance[];
  strengths: string[];
  weaknesses: string[];
  actionableFeedback: string[];
  hiringReadiness: string;
  terminationReason: string | null;
  totalQuestions: number;
  answeredQuestions: number;
  averageTimePerQuestion: number;
}

export interface InterviewSession {
  state: InterviewState;
  resumeData: ResumeData | null;
  jdData: JDData | null;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  answers: AnswerRecord[];
  currentDifficulty: Difficulty;
  consecutivePoorScores: number;
  questionPool: Question[];
  result: InterviewResult | null;
}

// Thresholds
export const SCORE_THRESHOLD = {
  GOOD: 15, // out of 25 - increase difficulty
  POOR: 10, // out of 25 - decrease difficulty
  EARLY_TERMINATION_AVG: 8, // average score threshold
  CONSECUTIVE_POOR_LIMIT: 3,
};

export const TIME_LIMITS = {
  EASY: 90, // seconds
  MEDIUM: 120,
  HARD: 180,
};

export const MAX_QUESTIONS = 10;
export const MIN_QUESTIONS_BEFORE_TERMINATION = 3;
