import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { ProgressRing } from '@/components/ui/progress-ring';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SkillChip } from '@/components/ui/skill-chip';
import { ArrowLeft, Sparkles, TrendingUp, Rocket, Brain, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SkillTwinPage = () => {
  const navigate = useNavigate();

  const growthData = [
    { period: '30 Days', skills: 3, growth: 35, color: 'cyan' as const },
    { period: '60 Days', skills: 7, growth: 62, color: 'gradient' as const },
    { period: '90 Days', skills: 12, growth: 85, color: 'purple' as const },
  ];

  const futureSkills = [
    'Advanced ML Ops', 'System Design', 'Cloud Architecture', 'Leadership',
    'Technical Writing', 'Open Source Contribution'
  ];

  const aiInsight = "Based on your current trajectory and learning patterns, Gemini AI predicts you'll reach Senior Developer proficiency within 8 months. Your strongest growth areas are in cloud technologies and system design. Consider focusing on leadership skills to accelerate your path to a principal engineer role.";

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan to-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">SkillTwin</h1>
            <p className="text-muted-foreground">Your AI-predicted future self</p>
          </div>
        </FadeIn>

        {/* Job Readiness Ring */}
        <FadeIn delay={0.1}>
          <Card variant="glow" className="p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ProgressRing 
                progress={78} 
                size={160}
                strokeWidth={10}
                label="78%"
                sublabel="Job Ready"
                color="hsl(187, 94%, 43%)"
              />
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                  <Rocket className="w-5 h-5 text-cyan" />
                  <span className="font-bold font-display text-xl">Almost There!</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  You're 78% ready for your target role as a <span className="text-foreground font-medium">Full Stack Developer</span> at top tech companies.
                </p>
                <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-cyan/20 text-xs">Target: Senior Developer</span>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-xs">Timeline: 8 months</span>
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Growth Timeline */}
        <StaggerContainer staggerDelay={0.1}>
          <StaggerItem>
            <Card variant="glass" className="p-6 mb-6">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan" />
                  Growth Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {growthData.map((item, index) => (
                  <motion.div
                    key={item.period}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.15 }}
                  >
                    <ProgressBar
                      progress={item.growth}
                      label={item.period}
                      sublabel={`+${item.skills} new skills`}
                      color={item.color}
                      size="lg"
                    />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card variant="glass" className="p-6 mb-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Future Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground mb-4">Skills you'll likely develop based on your trajectory:</p>
                <div className="flex flex-wrap gap-2">
                  {futureSkills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <SkillChip skill={skill} variant="outline" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card variant="glass" className="p-6 mb-8">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan" />
                  AI Insight
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground leading-relaxed">{aiInsight}</p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* CTA */}
        <FadeIn delay={0.6}>
          <Button 
            variant="gradient" 
            size="xl" 
            className="w-full"
            onClick={() => navigate('/career-roadmap')}
          >
            <Map className="w-5 h-5 mr-2" />
            Generate Career Roadmap
          </Button>
        </FadeIn>
      </div>
    </div>
  );
};
