import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/PageTransition';
import { Loader } from '@/components/ui/loader';
import { ProgressRing } from '@/components/ui/progress-ring';
import { SkillChip } from '@/components/ui/skill-chip';
import { ArrowLeft, Upload, FileText, Sparkles, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SkillEvaluationPage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [inputText, setInputText] = useState('');

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text or upload a file to analyze');
      return;
    }
    setStage('analyzing');
    setTimeout(() => setStage('results'), 2500);
  };

  const mockResults = {
    score: 847,
    skills: ['React.js', 'TypeScript', 'Node.js', 'Python', 'Machine Learning', 'UI/UX Design', 'Cloud Computing'],
    difficulty: 'Advanced',
    confidence: 92,
    explanation: 'Based on the evidence provided, you demonstrate strong proficiency in full-stack development with particular expertise in modern JavaScript frameworks. Your ML projects show practical application of algorithms, and your portfolio indicates a solid understanding of design principles. Gemini AI analysis suggests you are in the top 15% of developers with similar experience levels.',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <FadeIn>
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/student')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Skill Evaluation</h1>
            <p className="text-muted-foreground">Upload your evidence and get AI-powered skill assessment</p>
          </div>
        </FadeIn>

        {/* Upload Stage */}
        {stage === 'upload' && (
          <FadeIn>
            <Card variant="glass" className="p-6">
              <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center mb-6 hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop files here, or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOC, images, GitHub links</p>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-muted-foreground bg-card">or paste text</span>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your project description, GitHub README, portfolio content, or any evidence of your skills..."
                className="w-full h-40 p-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              />

              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full mt-6"
                onClick={handleAnalyze}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze with Gemini AI
              </Button>
            </Card>
          </FadeIn>
        )}

        {/* Analyzing Stage */}
        {stage === 'analyzing' && (
          <Card variant="glass" className="p-8">
            <Loader text="Gemini AI is analyzing your skills..." size="lg" />
          </Card>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
          <FadeIn>
            <Card variant="glow" className="p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ProgressRing 
                  progress={mockResults.score / 10} 
                  size={140}
                  label={mockResults.score.toString()}
                  sublabel="Skill Score"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <CheckCircle className="w-5 h-5 text-cyan" />
                    <span className="text-sm text-cyan font-medium">Analysis Complete</span>
                  </div>
                  <h2 className="text-2xl font-bold font-display mb-2">Your Skill Passport</h2>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-sm">Difficulty: {mockResults.difficulty}</span>
                    <span className="px-3 py-1 rounded-full bg-cyan/20 text-sm">Confidence: {mockResults.confidence}%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6 mb-6">
              <h3 className="text-lg font-bold font-display mb-4">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {mockResults.skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SkillChip skill={skill} variant="glow" />
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card variant="glass" className="p-6 mb-6">
              <h3 className="text-lg font-bold font-display mb-4">AI Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">{mockResults.explanation}</p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gradient" size="lg" className="flex-1" onClick={() => navigate('/skilltwin')}>
                <Sparkles className="w-5 h-5 mr-2" />
                Add to SkillTwin
              </Button>
              <Button variant="glass" size="lg" className="flex-1" onClick={() => navigate('/mentor-matching')}>
                <Users className="w-5 h-5 mr-2" />
                Find Mentors
              </Button>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
