import { Question, AnswerScore, ResumeData, JDData } from './types';

// Scoring weights
const WEIGHTS = {
  KEYWORD_MATCH: 0.3,
  LENGTH_DEPTH: 0.2,
  RELEVANCE: 0.25,
  TIME_EFFICIENCY: 0.25,
};

// Minimum word counts for different depths
const DEPTH_THRESHOLDS = {
  MINIMAL: 10,
  BASIC: 25,
  MODERATE: 50,
  GOOD: 100,
  EXCELLENT: 150,
};

function calculateKeywordScore(answer: string, expectedKeywords: string[]): number {
  if (!answer || expectedKeywords.length === 0) return 0;
  
  const lowerAnswer = answer.toLowerCase();
  let matchedCount = 0;
  
  for (const keyword of expectedKeywords) {
    const pattern = new RegExp(`\\b${keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(lowerAnswer)) {
      matchedCount++;
    }
  }
  
  const matchRatio = matchedCount / expectedKeywords.length;
  
  // Score 0-5 based on match ratio
  if (matchRatio >= 0.8) return 5;
  if (matchRatio >= 0.6) return 4;
  if (matchRatio >= 0.4) return 3;
  if (matchRatio >= 0.2) return 2;
  if (matchRatio > 0) return 1;
  return 0;
}

function calculateDepthScore(answer: string): number {
  if (!answer) return 0;
  
  const wordCount = answer.trim().split(/\s+/).length;
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  // Check for code blocks or examples (bonus)
  const hasCodeExample = /```|`[^`]+`|function|const |let |var |=>/.test(answer);
  const hasExample = /for example|such as|e\.g\.|like |consider/i.test(answer);
  
  let score = 0;
  
  // Base score on word count
  if (wordCount >= DEPTH_THRESHOLDS.EXCELLENT) score = 5;
  else if (wordCount >= DEPTH_THRESHOLDS.GOOD) score = 4;
  else if (wordCount >= DEPTH_THRESHOLDS.MODERATE) score = 3;
  else if (wordCount >= DEPTH_THRESHOLDS.BASIC) score = 2;
  else if (wordCount >= DEPTH_THRESHOLDS.MINIMAL) score = 1;
  
  // Bonus for structure
  if (sentenceCount >= 3 && score < 5) score += 0.5;
  if ((hasCodeExample || hasExample) && score < 5) score += 0.5;
  
  return Math.min(5, Math.round(score));
}

function calculateClarityScore(answer: string): number {
  if (!answer) return 0;
  
  // Check for clear structure indicators
  const hasStructure = /first|second|third|finally|additionally|moreover|however|therefore/i.test(answer);
  const hasTransitions = /because|since|therefore|thus|as a result|consequently/i.test(answer);
  const hasClearExplanation = /this means|in other words|specifically|essentially/i.test(answer);
  
  // Check for rambling (very long sentences without punctuation)
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / Math.max(sentences.length, 1);
  
  let score = 3; // Base score
  
  if (hasStructure) score += 0.5;
  if (hasTransitions) score += 0.5;
  if (hasClearExplanation) score += 0.5;
  
  // Penalty for very long average sentence length (unclear)
  if (avgSentenceLength > 40) score -= 1;
  
  // Penalty for very short answers
  if (answer.length < 50) score -= 1;
  
  return Math.max(0, Math.min(5, Math.round(score)));
}

function calculateRelevanceScore(
  answer: string,
  question: Question,
  resumeData: ResumeData | null,
  jdData: JDData | null
): number {
  if (!answer) return 0;
  
  const lowerAnswer = answer.toLowerCase();
  let relevanceScore = 0;
  
  // Check relevance to question keywords
  const keywordRelevance = calculateKeywordScore(answer, question.expectedKeywords);
  relevanceScore += keywordRelevance * 0.5;
  
  // Check if answer relates to the skill being tested
  if (lowerAnswer.includes(question.skillTested.toLowerCase())) {
    relevanceScore += 0.5;
  }
  
  // Check relevance to resume skills
  if (resumeData) {
    const resumeSkillMentioned = resumeData.skills.some(
      skill => lowerAnswer.includes(skill.name.toLowerCase())
    );
    if (resumeSkillMentioned) relevanceScore += 0.5;
  }
  
  // Check relevance to JD
  if (jdData) {
    const jdSkillMentioned = jdData.requiredSkills.some(
      skill => lowerAnswer.includes(skill.name.toLowerCase())
    );
    if (jdSkillMentioned) relevanceScore += 0.5;
  }
  
  // Penalty for off-topic indicators
  const offTopicIndicators = /i don't know|not sure|skip|pass|no idea/i;
  if (offTopicIndicators.test(answer)) {
    relevanceScore -= 2;
  }
  
  return Math.max(0, Math.min(5, Math.round(relevanceScore)));
}

function calculateTimeEfficiencyScore(timeTaken: number, timeLimit: number): number {
  if (timeTaken <= 0) return 0; // Timeout or instant (suspicious)
  
  const timeRatio = timeTaken / timeLimit;
  
  // Optimal: 50-80% of time limit
  if (timeRatio >= 0.5 && timeRatio <= 0.8) return 5;
  
  // Good: 30-50% or 80-100%
  if (timeRatio >= 0.3 && timeRatio < 0.5) return 4;
  if (timeRatio > 0.8 && timeRatio <= 1.0) return 4;
  
  // Acceptable: 20-30% or slightly over time
  if (timeRatio >= 0.2 && timeRatio < 0.3) return 3;
  if (timeRatio > 1.0 && timeRatio <= 1.2) return 3;
  
  // Poor: too fast or too slow
  if (timeRatio < 0.2) return 2; // Suspiciously fast
  if (timeRatio > 1.2 && timeRatio <= 1.5) return 2;
  
  // Very poor: way over time
  if (timeRatio > 1.5) return 1;
  
  return 0; // Timeout
}

function generateFeedback(score: AnswerScore, question: Question): string {
  const feedbackParts: string[] = [];
  
  // Accuracy feedback
  if (score.accuracy >= 4) {
    feedbackParts.push('Good coverage of key concepts.');
  } else if (score.accuracy >= 2) {
    feedbackParts.push('Partially covered expected topics. Consider expanding on key terms.');
  } else {
    feedbackParts.push('Missing critical keywords. Review the fundamentals of this topic.');
  }
  
  // Depth feedback
  if (score.depth >= 4) {
    feedbackParts.push('Excellent depth with good examples.');
  } else if (score.depth >= 2) {
    feedbackParts.push('Could benefit from more detailed explanations or examples.');
  } else {
    feedbackParts.push('Answer is too brief. Provide more comprehensive responses.');
  }
  
  // Clarity feedback
  if (score.clarity >= 4) {
    feedbackParts.push('Well-structured and clear.');
  } else if (score.clarity < 3) {
    feedbackParts.push('Try to organize your answer with clearer structure.');
  }
  
  // Time feedback
  if (score.timeEfficiency >= 4) {
    feedbackParts.push('Good time management.');
  } else if (score.timeEfficiency <= 2) {
    feedbackParts.push('Watch your time - aim for 50-80% of the allocated time.');
  }
  
  return feedbackParts.join(' ');
}

export function evaluateAnswer(
  answer: string,
  question: Question,
  timeTaken: number,
  resumeData: ResumeData | null,
  jdData: JDData | null
): AnswerScore {
  const accuracy = calculateKeywordScore(answer, question.expectedKeywords);
  const clarity = calculateClarityScore(answer);
  const depth = calculateDepthScore(answer);
  const relevance = calculateRelevanceScore(answer, question, resumeData, jdData);
  const timeEfficiency = calculateTimeEfficiencyScore(timeTaken, question.timeLimit);
  
  const total = accuracy + clarity + depth + relevance + timeEfficiency;
  
  const score: AnswerScore = {
    accuracy,
    clarity,
    depth,
    relevance,
    timeEfficiency,
    total,
    feedback: '',
  };
  
  score.feedback = generateFeedback(score, question);
  
  return score;
}
