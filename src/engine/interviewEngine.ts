import {
  InterviewSession,
  InterviewState,
  Difficulty,
  ResumeData,
  JDData,
  AnswerRecord,
  InterviewResult,
  SkillPerformance,
  SCORE_THRESHOLD,
  MAX_QUESTIONS,
  MIN_QUESTIONS_BEFORE_TERMINATION,
} from './types';
import { parseResume } from './resumeParser';
import { parseJD } from './jdParser';
import { buildQuestionPool, getNextQuestion } from './questionBank';
import { evaluateAnswer } from './evaluator';

// Create initial session
export function createSession(): InterviewSession {
  return {
    state: 'INIT',
    resumeData: null,
    jdData: null,
    currentQuestionIndex: 0,
    currentQuestion: null,
    answers: [],
    currentDifficulty: 'MEDIUM',
    consecutivePoorScores: 0,
    questionPool: [],
    result: null,
  };
}

// State transition function
export function transitionState(
  session: InterviewSession,
  action: string,
  payload?: unknown
): InterviewSession {
  const newSession = { ...session };

  switch (session.state) {
    case 'INIT':
      if (action === 'START_ANALYSIS' && payload) {
        const { resumeText, jdText } = payload as { resumeText: string; jdText: string };
        newSession.state = 'RESUME_ANALYSIS';
        newSession.resumeData = parseResume(resumeText);
        newSession.jdData = parseJD(jdText);
        return transitionState(newSession, 'ANALYSIS_COMPLETE');
      }
      break;

    case 'RESUME_ANALYSIS':
    case 'JD_ANALYSIS':
      if (action === 'ANALYSIS_COMPLETE') {
        newSession.state = 'QUESTIONING';
        
        // Build question pool based on extracted skills
        const skills = [
          ...(newSession.resumeData?.skills.map(s => s.name) || []),
          ...(newSession.jdData?.requiredSkills.map(s => s.name) || []),
        ];
        const uniqueSkills = [...new Set(skills)];
        newSession.questionPool = buildQuestionPool(uniqueSkills, MAX_QUESTIONS);
        
        // Get first question
        const usedIds = new Set<string>();
        const firstQuestion = getNextQuestion(newSession.questionPool, usedIds, 'MEDIUM');
        newSession.currentQuestion = firstQuestion;
        newSession.currentDifficulty = 'MEDIUM';
      }
      break;

    case 'QUESTIONING':
      if (action === 'SUBMIT_ANSWER' && payload) {
        const { answer, timeTaken } = payload as { answer: string; timeTaken: number };
        
        if (newSession.currentQuestion) {
          // Evaluate the answer
          const score = evaluateAnswer(
            answer,
            newSession.currentQuestion,
            timeTaken,
            newSession.resumeData,
            newSession.jdData
          );
          
          // Record the answer
          const answerRecord: AnswerRecord = {
            questionId: newSession.currentQuestion.id,
            answer,
            timeTaken,
            score,
            difficulty: newSession.currentDifficulty,
          };
          newSession.answers = [...newSession.answers, answerRecord];
          newSession.currentQuestionIndex++;
          
          // Update difficulty based on score
          if (score.total >= SCORE_THRESHOLD.GOOD) {
            newSession.consecutivePoorScores = 0;
            if (newSession.currentDifficulty === 'EASY') {
              newSession.currentDifficulty = 'MEDIUM';
            } else if (newSession.currentDifficulty === 'MEDIUM') {
              newSession.currentDifficulty = 'HARD';
            }
          } else if (score.total < SCORE_THRESHOLD.POOR) {
            newSession.consecutivePoorScores++;
            if (newSession.currentDifficulty === 'HARD') {
              newSession.currentDifficulty = 'MEDIUM';
            } else if (newSession.currentDifficulty === 'MEDIUM') {
              newSession.currentDifficulty = 'EASY';
            }
          } else {
            newSession.consecutivePoorScores = 0;
          }
          
          // Check for early termination
          if (shouldTerminateEarly(newSession)) {
            newSession.state = 'EARLY_TERMINATION';
            return transitionState(newSession, 'GENERATE_RESULT');
          }
          
          // Check if interview is complete
          if (newSession.currentQuestionIndex >= MAX_QUESTIONS) {
            newSession.state = 'FINAL_EVALUATION';
            return transitionState(newSession, 'GENERATE_RESULT');
          }
          
          // Get next question
          const usedIds = new Set(newSession.answers.map(a => a.questionId));
          const nextQuestion = getNextQuestion(
            newSession.questionPool,
            usedIds,
            newSession.currentDifficulty
          );
          
          if (!nextQuestion) {
            newSession.state = 'FINAL_EVALUATION';
            return transitionState(newSession, 'GENERATE_RESULT');
          }
          
          newSession.currentQuestion = nextQuestion;
        }
      }
      break;

    case 'EARLY_TERMINATION':
    case 'FINAL_EVALUATION':
      if (action === 'GENERATE_RESULT') {
        newSession.result = generateResult(newSession);
        newSession.state = 'END';
      }
      break;
  }

  return newSession;
}

function shouldTerminateEarly(session: InterviewSession): boolean {
  // Don't terminate if we haven't asked minimum questions
  if (session.answers.length < MIN_QUESTIONS_BEFORE_TERMINATION) {
    return false;
  }
  
  // Check consecutive poor performances
  if (session.consecutivePoorScores >= SCORE_THRESHOLD.CONSECUTIVE_POOR_LIMIT) {
    return true;
  }
  
  // Check average score
  const avgScore = session.answers.reduce((sum, a) => sum + a.score.total, 0) / session.answers.length;
  if (avgScore < SCORE_THRESHOLD.EARLY_TERMINATION_AVG) {
    return true;
  }
  
  return false;
}

function generateResult(session: InterviewSession): InterviewResult {
  const { answers, resumeData, jdData } = session;
  
  if (answers.length === 0) {
    return {
      finalScore: 0,
      level: 'Needs Improvement',
      skillBreakdown: [],
      strengths: [],
      weaknesses: ['No questions were answered'],
      actionableFeedback: ['Complete the interview to receive feedback'],
      hiringReadiness: 'Unable to assess - interview not completed',
      terminationReason: 'No answers provided',
      totalQuestions: MAX_QUESTIONS,
      answeredQuestions: 0,
      averageTimePerQuestion: 0,
    };
  }
  
  // Calculate final score (normalized to 0-100)
  const totalPossibleScore = answers.length * 25;
  const actualScore = answers.reduce((sum, a) => sum + a.score.total, 0);
  const finalScore = Math.round((actualScore / totalPossibleScore) * 100);
  
  // Determine level
  let level: 'Strong' | 'Average' | 'Needs Improvement';
  if (finalScore >= 75) level = 'Strong';
  else if (finalScore >= 50) level = 'Average';
  else level = 'Needs Improvement';
  
  // Calculate skill breakdown
  const skillMap = new Map<string, { total: number; count: number }>();
  for (const answer of answers) {
    const question = session.questionPool.find(q => q.id === answer.questionId);
    if (question) {
      const existing = skillMap.get(question.skillTested) || { total: 0, count: 0 };
      existing.total += answer.score.total;
      existing.count++;
      skillMap.set(question.skillTested, existing);
    }
  }
  
  const skillBreakdown: SkillPerformance[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  skillMap.forEach((data, skill) => {
    const avgScore = data.total / data.count;
    const normalizedScore = (avgScore / 25) * 100;
    const isStrength = normalizedScore >= 60;
    
    skillBreakdown.push({
      skill,
      questionsAttempted: data.count,
      averageScore: Math.round(normalizedScore),
      strength: isStrength,
    });
    
    if (isStrength) {
      strengths.push(skill);
    } else if (normalizedScore < 50) {
      weaknesses.push(skill);
    }
  });
  
  // Generate actionable feedback
  const actionableFeedback: string[] = [];
  
  // Analyze score components
  const avgAccuracy = answers.reduce((sum, a) => sum + a.score.accuracy, 0) / answers.length;
  const avgDepth = answers.reduce((sum, a) => sum + a.score.depth, 0) / answers.length;
  const avgClarity = answers.reduce((sum, a) => sum + a.score.clarity, 0) / answers.length;
  const avgTimeEff = answers.reduce((sum, a) => sum + a.score.timeEfficiency, 0) / answers.length;
  
  if (avgAccuracy < 3) {
    actionableFeedback.push('Review core concepts and technical terminology for your field');
  }
  if (avgDepth < 3) {
    actionableFeedback.push('Practice providing more detailed answers with concrete examples');
  }
  if (avgClarity < 3) {
    actionableFeedback.push('Work on structuring your answers more clearly');
  }
  if (avgTimeEff < 3) {
    actionableFeedback.push('Practice answering questions within time constraints');
  }
  
  for (const weakness of weaknesses.slice(0, 3)) {
    actionableFeedback.push(`Strengthen your knowledge in ${weakness}`);
  }
  
  if (actionableFeedback.length === 0) {
    actionableFeedback.push('Continue practicing to maintain your strong performance');
  }
  
  // Hiring readiness assessment
  let hiringReadiness: string;
  if (finalScore >= 75) {
    hiringReadiness = `Strong candidate for ${jdData?.roleTitle || 'this role'}. Ready for final interview rounds.`;
  } else if (finalScore >= 60) {
    hiringReadiness = `Promising candidate with some areas to develop. Could progress to next round with preparation.`;
  } else if (finalScore >= 50) {
    hiringReadiness = `Has foundational knowledge but needs more preparation. Recommend further skill development.`;
  } else {
    hiringReadiness = `Significant gaps in required skills. Recommend focused preparation before next attempt.`;
  }
  
  // Termination reason
  let terminationReason: string | null = null;
  if (session.state === 'EARLY_TERMINATION') {
    if (session.consecutivePoorScores >= SCORE_THRESHOLD.CONSECUTIVE_POOR_LIMIT) {
      terminationReason = `Interview ended early due to ${session.consecutivePoorScores} consecutive low scores`;
    } else {
      terminationReason = 'Interview ended early due to low average performance';
    }
  }
  
  return {
    finalScore,
    level,
    skillBreakdown,
    strengths: strengths.length > 0 ? strengths : ['General problem-solving approach'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['No significant weaknesses identified'],
    actionableFeedback,
    hiringReadiness,
    terminationReason,
    totalQuestions: MAX_QUESTIONS,
    answeredQuestions: answers.length,
    averageTimePerQuestion: Math.round(
      answers.reduce((sum, a) => sum + a.timeTaken, 0) / answers.length
    ),
  };
}

// Export helper to check if interview is complete
export function isInterviewComplete(session: InterviewSession): boolean {
  return session.state === 'END';
}

// Export helper to get current progress
export function getProgress(session: InterviewSession): {
  current: number;
  total: number;
  percentage: number;
} {
  return {
    current: session.currentQuestionIndex,
    total: MAX_QUESTIONS,
    percentage: Math.round((session.currentQuestionIndex / MAX_QUESTIONS) * 100),
  };
}
