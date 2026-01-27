import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ArrowLeft, Map, CheckCircle, Circle, Users, Target, BookOpen, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CareerRoadmapPage = () => {
  const navigate = useNavigate();

  const weeks = [
    {
      week: 1,
      title: 'Foundation Building',
      tasks: [
        { task: 'Complete Advanced React patterns course', done: true },
        { task: 'Build a complex state management system', done: true },
        { task: 'Contribute to an open-source project', done: false },
      ],
      progress: 66,
      icon: BookOpen,
    },
    {
      week: 2,
      title: 'System Design Mastery',
      tasks: [
        { task: 'Study distributed systems architecture', done: false },
        { task: 'Design a scalable microservices system', done: false },
        { task: 'Practice system design interviews', done: false },
      ],
      progress: 0,
      icon: Code,
    },
    {
      week: 3,
      title: 'Leadership & Soft Skills',
      tasks: [
        { task: 'Lead a team code review session', done: false },
        { task: 'Mentor a junior developer', done: false },
        { task: 'Present a technical topic to peers', done: false },
      ],
      progress: 0,
      icon: Target,
    },
  ];

  const learningGoals = [
    { goal: 'Master TypeScript generics', progress: 85 },
    { goal: 'Learn Kubernetes basics', progress: 45 },
    { goal: 'Study ML fundamentals', progress: 30 },
    { goal: 'Improve system design skills', progress: 60 },
  ];

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Career Roadmap</h1>
            <p className="text-muted-foreground">Your personalized path to success</p>
          </div>
        </FadeIn>

        {/* Overall Progress */}
        <FadeIn delay={0.1}>
          <Card variant="glow" className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold font-display">12-Week Plan</h2>
                <p className="text-sm text-muted-foreground">On track to reach your goals</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold gradient-text">22%</span>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            <ProgressBar progress={22} showPercentage={false} size="lg" />
          </Card>
        </FadeIn>

        {/* Weekly Tasks */}
        <StaggerContainer staggerDelay={0.1}>
          {weeks.map((week, weekIndex) => (
            <StaggerItem key={week.week}>
              <Card variant="glass" className="p-6 mb-4">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${week.progress > 0 ? 'bg-gradient-to-br from-primary to-cyan' : 'bg-secondary'}`}>
                        <week.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Week {week.week}: {week.title}</CardTitle>
                      </div>
                    </div>
                    <span className="text-sm font-bold gradient-text">{week.progress}%</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3">
                    {week.tasks.map((item, taskIndex) => (
                      <motion.div
                        key={taskIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + taskIndex * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        {item.done ? (
                          <CheckCircle className="w-5 h-5 text-cyan flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${item.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {item.task}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Learning Goals */}
        <FadeIn delay={0.4}>
          <Card variant="glass" className="p-6 mb-8">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {learningGoals.map((goal, index) => (
                <motion.div
                  key={goal.goal}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <ProgressBar
                    progress={goal.progress}
                    label={goal.goal}
                    size="sm"
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Action Buttons */}
        <FadeIn delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="gradient" 
              size="lg" 
              className="flex-1"
              onClick={() => navigate('/mentor-matching')}
            >
              <Users className="w-5 h-5 mr-2" />
              Meet a Mentor
            </Button>
            <Button 
              variant="glass" 
              size="lg" 
              className="flex-1"
              onClick={() => navigate('/student')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
