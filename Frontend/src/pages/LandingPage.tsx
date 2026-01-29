import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { Sparkles, Zap, Brain, ArrowRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, title: 'AI-Powered Analysis', desc: 'Gemini AI evaluates your real skills' },
    { icon: Zap, title: 'Instant Insights', desc: 'Get actionable career guidance' },
    { icon: Sparkles, title: 'Skill Passport', desc: 'Build your verified skill profile' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated blue/purple background blobs */}
      <div className="animated-bg pointer-events-none" />
      <FadeIn className="text-center max-w-4xl mx-auto z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-3 px-8 py-4 glass-card rounded-full shadow-xl border-2 border-cyan-400/30 backdrop-blur-lg"
        >
          <span className="text-3xl md:text-4xl font-bold font-display gradient-text drop-shadow-lg">Back-2-Campus</span>
        </motion.div>

        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight drop-shadow-xl"
        >
          Build Careers on <span className="gradient-text animate-pulse">Skills</span>.<br />
          <span className="gradient-text">Not Claims.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto drop-shadow-lg"
        >
          Let <span className="font-bold text-cyan-400">AI</span> measure what you actually know.<br />
          Get <span className="font-bold text-purple-400">smart insights</span>, skill validation, and mentorship that helps you grow, stand out, and build a future you deserve.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          <Button 
            variant="gradient" 
            size="xl" 
            onClick={() => navigate('/login')}
            className="group shadow-lg gradient-button px-8 py-4 text-lg"
          >
            Login
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 ml-2" />
          </Button>
          <Button 
            variant="glass" 
            size="xl" 
            onClick={() => navigate('/signup')}
            className="shadow-lg px-8 py-4 text-lg border border-cyan-400/40 hover:border-purple-400/40"
          >
            Sign Up
          </Button>
        </motion.div>

        {/* Features */}
        <StaggerContainer className="grid md:grid-cols-3 gap-8 mt-8" staggerDelay={0.15}>
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                className="feature-card group text-center cursor-pointer shadow-xl border-2 border-transparent hover:border-cyan-400/60 bg-white/10 backdrop-blur-lg"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-purple-400/30 flex items-center justify-center mx-auto mb-4 group-hover:shadow-[0_0_40px_hsl(262,83%,58%/0.5)] transition-shadow">
                  <feature.icon className="w-8 h-8 text-cyan-400 drop-shadow-md" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2 text-white drop-shadow">{feature.title}</h3>
                <p className="text-base text-cyan-100/80 mb-2">{feature.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </FadeIn>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-0 w-full text-center text-sm text-cyan-100/80 z-20 drop-shadow"
      >
        © {new Date().getFullYear()} Back-2-Campus. Crafted with <span className="text-purple-400">♥</span> for your future.
      </motion.footer>
    </div>
  );
};
