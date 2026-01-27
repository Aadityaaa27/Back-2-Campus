import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SkillChip } from '@/components/ui/skill-chip';
import { ArrowLeft, Building, TrendingUp, Users, Award, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UniversityInsightsPage = () => {
  const navigate = useNavigate();

  const skillGaps = [
    { skill: 'Cloud Computing', gap: 45, trend: 'rising' },
    { skill: 'Data Science', gap: 38, trend: 'rising' },
    { skill: 'Mobile Development', gap: 32, trend: 'stable' },
    { skill: 'DevOps', gap: 28, trend: 'rising' },
  ];

  const topSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'TypeScript', 'AWS'
  ];

  const mentorStats = {
    totalMentors: 156,
    activeSessions: 342,
    avgRating: 4.8,
    studentsMatched: 1247,
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-glow flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">University Insights</h1>
            <p className="text-muted-foreground">Analytics dashboard for skill trends and engagement</p>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" staggerDelay={0.1}>
          {[
            { label: 'Total Mentors', value: mentorStats.totalMentors, icon: Users },
            { label: 'Active Sessions', value: mentorStats.activeSessions, icon: BarChart3 },
            { label: 'Avg Rating', value: mentorStats.avgRating, icon: Award },
            { label: 'Students Matched', value: mentorStats.studentsMatched, icon: TrendingUp },
          ].map((stat, index) => (
            <StaggerItem key={stat.label}>
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-cyan/20 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-cyan" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-display gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Skill Gaps */}
          <FadeIn delay={0.3}>
            <Card variant="glass" className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan" />
                  Industry Skill Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {skillGaps.map((item, index) => (
                  <motion.div
                    key={item.skill}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.skill}</span>
                      <span className={`text-xs ${item.trend === 'rising' ? 'text-cyan' : 'text-muted-foreground'}`}>
                        {item.trend === 'rising' ? '↑ Rising' : '→ Stable'}
                      </span>
                    </div>
                    <ProgressBar progress={item.gap} showPercentage={false} size="sm" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Top Skills */}
          <FadeIn delay={0.4}>
            <Card variant="glass" className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Top Skills in Demand
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Most requested skills by industry mentors this month
                </p>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <SkillChip skill={skill} variant={index < 3 ? 'glow' : 'default'} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Mentor Engagement */}
        <FadeIn delay={0.5}>
          <Card variant="glow" className="p-6 mt-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan" />
                Mentor Engagement Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'This Week', sessions: 89, change: '+12%' },
                  { label: 'This Month', sessions: 342, change: '+8%' },
                  { label: 'Avg Duration', sessions: '45 min', change: '+5%' },
                  { label: 'Completion Rate', sessions: '94%', change: '+2%' },
                ].map((item, index) => (
                  <div key={item.label} className="text-center p-3 rounded-xl bg-secondary/30">
                    <p className="text-2xl font-bold font-display gradient-text">{item.sessions}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xs text-cyan mt-1">{item.change}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};
