import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [errors, setErrors] = useState<{ resume?: string; jd?: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { resume?: string; jd?: string } = {};

    if (!resumeText.trim() || resumeText.trim().length < 50) {
      newErrors.resume = 'Please provide a resume with at least 50 characters';
    }
    if (!jdText.trim() || jdText.trim().length < 50) {
      newErrors.jd = 'Please provide a job description with at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartInterview = () => {
    if (validateInputs()) {
      // Store data in sessionStorage for the interview page
      sessionStorage.setItem('interviewData', JSON.stringify({
        resumeText: resumeText.trim(),
        jdText: jdText.trim(),
      }));
      navigate('/interview');
    }
  };

  const features = [
    'Adaptive difficulty based on your performance',
    'Skill-based question selection',
    'Real-time scoring and feedback',
    'Detailed performance breakdown',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Mock Interview</h1>
              <p className="text-sm text-muted-foreground">Practice smarter, interview better</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Prepare for Your Next Interview
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI-powered system analyzes your resume and the job description to create 
              a personalized mock interview experience with adaptive difficulty.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Input Forms */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Resume Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Your Resume
                </CardTitle>
                <CardDescription>
                  Paste your resume text including skills, experience, and projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="resume" className="sr-only">Resume</Label>
                  <Textarea
                    id="resume"
                    placeholder="Paste your resume here...

Example:
John Doe - Software Engineer
5+ years of experience in full-stack development

Skills: JavaScript, TypeScript, React, Node.js, Python, SQL, AWS

Experience:
- Senior Developer at TechCorp (2020-Present)
- Built scalable microservices architecture
- Led team of 5 engineers

Projects:
- E-commerce platform with 100k+ users
- Real-time analytics dashboard"
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      if (errors.resume) setErrors({ ...errors, resume: undefined });
                    }}
                    className="min-h-[250px] resize-none"
                  />
                  {errors.resume && (
                    <p className="text-sm text-destructive">{errors.resume}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {resumeText.length} characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* JD Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste the job description you're preparing for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="jd" className="sr-only">Job Description</Label>
                  <Textarea
                    id="jd"
                    placeholder="Paste the job description here...

Example:
Senior Software Engineer

Required Skills:
- 3+ years experience with JavaScript/TypeScript
- Strong React and Node.js experience
- Experience with SQL and NoSQL databases
- AWS or cloud platform experience

Preferred:
- Experience with microservices
- Knowledge of CI/CD pipelines
- Strong communication skills"
                    value={jdText}
                    onChange={(e) => {
                      setJdText(e.target.value);
                      if (errors.jd) setErrors({ ...errors, jd: undefined });
                    }}
                    className="min-h-[250px] resize-none"
                  />
                  {errors.jd && (
                    <p className="text-sm text-destructive">{errors.jd}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {jdText.length} characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleStartInterview}
              className="px-8 py-6 text-lg gap-2"
            >
              Start Interview
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              The interview consists of up to 10 questions with adaptive difficulty
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
