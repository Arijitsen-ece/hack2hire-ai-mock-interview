import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, ArrowRight, Briefcase } from 'lucide-react';
import {
  createSession,
  transitionState,
  isInterviewComplete,
  getProgress,
} from '@/engine/interviewEngine';
import type { InterviewSession, Difficulty } from '@/engine/types';

const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const styles: Record<Difficulty, string> = {
    EASY: 'bg-green-100 text-green-800 border-green-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    HARD: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <Badge variant="outline" className={styles[difficulty]}>
      {difficulty}
    </Badge>
  );
};

const Interview = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Initialize session
  useEffect(() => {
    const storedData = sessionStorage.getItem('interviewData');
    
    if (!storedData) {
      navigate('/');
      return;
    }

    const { resumeText, jdText } = JSON.parse(storedData);
    
    let newSession = createSession();
    newSession = transitionState(newSession, 'START_ANALYSIS', { resumeText, jdText });
    
    setSession(newSession);
    
    if (newSession.currentQuestion) {
      setTimeRemaining(newSession.currentQuestion.timeLimit);
      setStartTime(Date.now());
    }
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (!session?.currentQuestion || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.currentQuestion?.id]);

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (!session || !session.currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    const newSession = transitionState(session, 'SUBMIT_ANSWER', {
      answer: answer.trim(),
      timeTaken,
    });

    setSession(newSession);
    setAnswer('');

    if (isInterviewComplete(newSession)) {
      // Store result and navigate
      sessionStorage.setItem('interviewResult', JSON.stringify(newSession.result));
      sessionStorage.setItem('interviewAnswers', JSON.stringify(newSession.answers));
      navigate('/results');
    } else if (newSession.currentQuestion) {
      setTimeRemaining(newSession.currentQuestion.timeLimit);
      setStartTime(Date.now());
    }

    setIsSubmitting(false);
  }, [session, answer, startTime, navigate, isSubmitting]);

  // Auto-submit on timeout
  useEffect(() => {
    if (timeRemaining === 0 && session?.currentQuestion && !isSubmitting) {
      handleSubmit();
    }
  }, [timeRemaining, session, isSubmitting, handleSubmit]);

  if (!session || !session.currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 rounded-lg bg-primary/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Preparing your interview...</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = getProgress(session);
  const timePercentage = (timeRemaining / session.currentQuestion.timeLimit) * 100;
  const isLowTime = timePercentage < 25;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Mock Interview</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Question {progress.current + 1} of {progress.total}
              </div>
              <div className="w-32">
                <Progress value={progress.percentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Timer and Difficulty */}
          <div className="flex items-center justify-between">
            <DifficultyBadge difficulty={session.currentDifficulty} />
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isLowTime ? 'bg-destructive/10 text-destructive' : 'bg-secondary'
            }`}>
              {isLowTime && <AlertTriangle className="h-4 w-4" />}
              <Clock className="h-4 w-4" />
              <span className="font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                isLowTime ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Badge variant="secondary">
                  {session.currentQuestion.type}
                </Badge>
                <span>•</span>
                <span>Skill: {session.currentQuestion.skillTested}</span>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {session.currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[200px] resize-none text-base"
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  {answer.split(/\s+/).filter(w => w).length} words
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {progress.current + 1 === progress.total ? 'Submit & Finish' : 'Submit Answer'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Structure your answer clearly. Use specific examples 
                and technical terms where appropriate. Aim to answer within 50-80% of the 
                allocated time for optimal scoring.
              </p>
            </CardContent>
          </Card>

          {/* Previous Scores (if any) */}
          {session.answers.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Current average: {Math.round(
                  session.answers.reduce((sum, a) => sum + a.score.total, 0) / 
                  session.answers.length / 25 * 100
                )}%
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Interview;
