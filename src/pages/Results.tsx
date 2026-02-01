import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import type { InterviewResult, AnswerRecord } from '@/engine/types';

const Results = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('interviewResult');
    const storedAnswers = sessionStorage.getItem('interviewAnswers');

    if (!storedResult) {
      navigate('/');
      return;
    }

    setResult(JSON.parse(storedResult));
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, [navigate]);

  const handleNewInterview = () => {
    sessionStorage.removeItem('interviewData');
    sessionStorage.removeItem('interviewResult');
    sessionStorage.removeItem('interviewAnswers');
    navigate('/');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Strong':
        return 'text-green-600 bg-green-100';
      case 'Average':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Strong':
        return <Trophy className="h-8 w-8 text-green-600" />;
      case 'Average':
        return <Target className="h-8 w-8 text-yellow-600" />;
      default:
        return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Interview Results</span>
            </div>
            <Button variant="outline" onClick={handleNewInterview} className="gap-2">
              <Home className="h-4 w-4" />
              New Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Early Termination Warning */}
          {result.terminationReason && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-destructive font-medium">{result.terminationReason}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Score Circle */}
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-8 border-secondary flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-foreground">{result.finalScore}</span>
                      <span className="text-lg text-muted-foreground">/100</span>
                    </div>
                  </div>
                </div>

                {/* Level and Summary */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    {getLevelIcon(result.level)}
                    <Badge className={`text-lg px-4 py-1 ${getLevelColor(result.level)}`}>
                      {result.level}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Interview Readiness Score
                  </h2>
                  <p className="text-muted-foreground">
                    Based on {result.answeredQuestions} of {result.totalQuestions} questions
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{result.answeredQuestions}</p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{result.averageTimePerQuestion}s</p>
                    <p className="text-xs text-muted-foreground">Avg. Time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Hiring Readiness Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground text-lg">{result.hiringReadiness}</p>
            </CardContent>
          </Card>

          {/* Skill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Skill Performance Breakdown
              </CardTitle>
              <CardDescription>
                Performance by skill area assessed during the interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.skillBreakdown.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{skill.skill}</span>
                      {skill.strength ? (
                        <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                          Strength
                        </Badge>
                      ) : skill.averageScore < 50 ? (
                        <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                          Needs Work
                        </Badge>
                      ) : null}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {skill.questionsAttempted} question{skill.questionsAttempted !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={skill.averageScore} className="flex-1" />
                    <span className="text-sm font-medium w-12 text-right">{skill.averageScore}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="capitalize">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span className="capitalize">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Actionable Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Actionable Feedback
              </CardTitle>
              <CardDescription>
                Specific steps to improve your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.actionableFeedback.map((feedback, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Answer Details (Expandable) */}
          {answers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Answer Details
                </CardTitle>
                <CardDescription>
                  Breakdown of each answer's score components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {answers.map((answerRecord, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge variant="outline" className={
                            answerRecord.difficulty === 'EASY' ? 'border-green-300 text-green-600' :
                            answerRecord.difficulty === 'MEDIUM' ? 'border-yellow-300 text-yellow-600' :
                            'border-red-300 text-red-600'
                          }>
                            {answerRecord.difficulty}
                          </Badge>
                        </div>
                        <span className="font-bold">{answerRecord.score.total}/25</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-center text-sm">
                        <div className="p-2 bg-secondary rounded">
                          <p className="font-medium">{answerRecord.score.accuracy}</p>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                        </div>
                        <div className="p-2 bg-secondary rounded">
                          <p className="font-medium">{answerRecord.score.clarity}</p>
                          <p className="text-xs text-muted-foreground">Clarity</p>
                        </div>
                        <div className="p-2 bg-secondary rounded">
                          <p className="font-medium">{answerRecord.score.depth}</p>
                          <p className="text-xs text-muted-foreground">Depth</p>
                        </div>
                        <div className="p-2 bg-secondary rounded">
                          <p className="font-medium">{answerRecord.score.relevance}</p>
                          <p className="text-xs text-muted-foreground">Relevance</p>
                        </div>
                        <div className="p-2 bg-secondary rounded">
                          <p className="font-medium">{answerRecord.score.timeEfficiency}</p>
                          <p className="text-xs text-muted-foreground">Time</p>
                        </div>
                      </div>
                      {answerRecord.score.feedback && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {answerRecord.score.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleNewInterview} size="lg" className="gap-2">
              Start New Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
