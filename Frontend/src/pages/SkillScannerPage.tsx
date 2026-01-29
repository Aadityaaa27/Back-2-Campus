import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/PageTransition';
import { SkillChip } from '@/components/ui/skill-chip';
import { Loader } from '@/components/ui/loader';
import { ArrowLeft, Wifi, WifiOff, Scan, Cloud, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SkillScannerPage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'idle' | 'scanning' | 'complete'>('idle');

  const handleScan = () => {
    setStage('scanning');
    setTimeout(() => setStage('complete'), 2500);
  };

  const extractedSkills = [
    'Python Programming', 'Data Analysis', 'SQL Databases', 'Machine Learning',
    'Statistical Modeling', 'Data Visualization', 'Pandas', 'NumPy'
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-glow to-cyan flex items-center justify-center mx-auto mb-4">
              <WifiOff className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">SkillScanner</h1>
            <p className="text-muted-foreground">Offline skill extraction from documents</p>
          </div>
        </FadeIn>

        {/* Offline Badge */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/30">
              <WifiOff className="w-4 h-4 text-cyan" />
              <span className="text-sm font-medium text-cyan">Offline Mode</span>
              <span className="text-xs text-muted-foreground">• Syncs when online</span>
            </div>
          </div>
        </FadeIn>

        {/* Main Content */}
        <FadeIn delay={0.2}>
          <Card variant="glass" className="p-6">
            {stage === 'idle' && (
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center mx-auto mb-6">
                  <Scan className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">Ready to Scan</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Upload a document or capture an image to extract skills using on-device AI
                </p>
                <Button variant="gradient" size="lg" onClick={handleScan}>
                  <Scan className="w-5 h-5 mr-2" />
                  Start Scanning
                </Button>
              </div>
            )}

            {stage === 'scanning' && (
              <div className="py-8">
                <Loader text="Processing document offline..." size="lg" />
              </div>
            )}

            {stage === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4"
              >
                <div className="flex items-center justify-center gap-2 mb-6">
                  <CheckCircle className="w-6 h-6 text-cyan" />
                  <span className="font-bold font-display text-lg">Skills Extracted</span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {extractedSkills.map((skill, index) => (
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

                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/30 mb-6">
                  <Cloud className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Will sync to your Skill Passport when connected
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => setStage('idle')}
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    Scan Another
                  </Button>
                  <Button 
                    variant="glass" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => navigate('/skill-evaluation')}
                  >
                    View Full Passport
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};
