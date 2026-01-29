import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/PageTransition';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ArrowLeft, Heart, Smile, Meh, Frown, RefreshCw, Lightbulb, Battery } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WellbeingPage = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckAgain = () => {
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 1500);
  };

  const moodIndicators = [
    { mood: 'Great', icon: Smile, color: 'text-cyan', active: false },
    { mood: 'Good', icon: Smile, color: 'text-cyan', active: true },
    { mood: 'Okay', icon: Meh, color: 'text-muted-foreground', active: false },
    { mood: 'Low', icon: Frown, color: 'text-destructive', active: false },
  ];

  const suggestions = [
    'Take a 15-minute break every 2 hours to maintain focus',
    'Consider a short walk outside to reduce screen fatigue',
    'Your sleep patterns suggest earlier bedtime could improve productivity',
    'Hydration reminder: Aim for 8 glasses of water today',
  ];

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-destructive flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Wellbeing Agent</h1>
            <p className="text-muted-foreground">Monitor your wellness and prevent burnout</p>
          </div>
        </FadeIn>

        {/* Burnout Meter */}
        <FadeIn delay={0.1}>
          <Card variant="glow" className="p-6 mb-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Battery className="w-5 h-5 text-cyan" />
                Burnout Risk Level
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="mb-4">
                <ProgressBar 
                  progress={35} 
                  color="gradient" 
                  size="lg"
                  label="Current Level"
                  sublabel="Low Risk"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Your stress indicators are within healthy range. Keep maintaining your current work-life balance.
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Mood Indicator */}
        <FadeIn delay={0.2}>
          <Card variant="glass" className="p-6 mb-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Current Mood</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-around">
                {moodIndicators.map((item) => (
                  <motion.div
                    key={item.mood}
                    whileHover={{ scale: 1.1 }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${
                      item.active ? 'bg-primary/20 border border-primary/50' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <item.icon className={`w-8 h-8 ${item.active ? 'text-cyan' : item.color}`} />
                    <span className={`text-sm ${item.active ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {item.mood}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* AI Suggestions */}
        <FadeIn delay={0.3}>
          <Card variant="glass" className="p-6 mb-8">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-cyan" />
                AI Wellness Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isChecking ? 0.5 : 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{suggestion}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Action Buttons */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="gradient" 
              size="lg" 
              className="flex-1"
              onClick={handleCheckAgain}
              disabled={isChecking}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Analyzing...' : 'Check Again'}
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
