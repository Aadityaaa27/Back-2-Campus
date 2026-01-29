import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/PageTransition';
import { ArrowLeft, Video, Play, Globe, Mic, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const WebinarsPage = () => {
  const navigate = useNavigate();

  const languages = ['English', 'Spanish', 'Hindi', 'Mandarin', 'French', 'German'];

  const handlePlay = () => {
    toast.info('Webinar playback started', {
      description: 'AI dubbing will be applied in real-time.',
    });
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan to-primary flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Global Webinars</h1>
            <p className="text-muted-foreground">Learn from experts worldwide in your language</p>
          </div>
        </FadeIn>

        {/* Featured Webinar */}
        <FadeIn delay={0.1}>
          <Card variant="glow" className="overflow-hidden mb-6">
            {/* Video Preview */}
            <div className="relative aspect-video bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="relative w-20 h-20 rounded-full bg-gradient-to-r from-primary to-cyan flex items-center justify-center shadow-lg shadow-primary/40"
              >
                <Play className="w-8 h-8 text-foreground ml-1" />
              </motion.button>
              
              {/* AI Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-cyan/50">
                <Mic className="w-4 h-4 text-cyan" />
                <span className="text-xs font-medium">AI-Dubbed using Gemini</span>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span>45 min</span>
                <span className="text-border">•</span>
                <Users className="w-4 h-4" />
                <span>2,847 viewers</span>
              </div>
              
              <h2 className="text-xl font-bold font-display mb-2">
                Building Scalable AI Systems: From Prototype to Production
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Learn how top tech companies scale their AI infrastructure from a Google Staff Engineer.
              </p>

              {/* Language Selector */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan" />
                  <span className="text-sm font-medium">Language:</span>
                </div>
                <select className="px-4 py-2 rounded-xl bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50">
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Upcoming Webinars */}
        <FadeIn delay={0.2}>
          <h3 className="text-lg font-bold font-display mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {[
              { title: 'Machine Learning for Beginners', time: 'Tomorrow, 3:00 PM', speaker: 'Dr. Lisa Park' },
              { title: 'Career Growth in Tech', time: 'Friday, 10:00 AM', speaker: 'Marcus Johnson' },
              { title: 'Open Source Contribution 101', time: 'Next Monday, 2:00 PM', speaker: 'Sarah Chen' },
            ].map((webinar, index) => (
              <motion.div
                key={webinar.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card variant="glass" className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{webinar.title}</h4>
                      <p className="text-sm text-muted-foreground">{webinar.speaker} • {webinar.time}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Remind Me
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
