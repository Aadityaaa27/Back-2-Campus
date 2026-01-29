import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { 
  GraduationCap, 
  FileCheck, 
  Users, 
  Sparkles, 
  Map, 
  Video, 
  Heart, 
  Wifi,
  Building,
  ArrowRight,
  LogOut,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const StudentDashboard = () => {
  const [userName, setUserName] = useState('');
  const [isNewSignup, setIsNewSignup] = useState(false);
  const [alumniSearchQuery, setAlumniSearchQuery] = useState('');
  
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const newSignup = localStorage.getItem('isNewSignup');
    
    if (storedName) setUserName(storedName);
    if (newSignup === 'true') {
      setIsNewSignup(true);
      // Clear the flag after showing welcome message once
      localStorage.removeItem('isNewSignup');
    }
  }, []);
  const navigate = useNavigate();

  const handleAlumniSearch = () => {
    if (alumniSearchQuery.trim()) {
      // Navigate to alumni page with search query
      navigate('/alumni', { state: { searchQuery: alumniSearchQuery } });
    } else {
      navigate('/alumni');
    }
  };

  const features = [
    { 
      icon: FileCheck, 
      title: 'Skill Evaluation', 
      desc: 'Upload evidence and get AI-powered skill assessment',
      path: '/skill-evaluation',
      color: 'from-primary to-purple-glow'
    },
    { 
      icon: Sparkles, 
      title: 'SkillTwin', 
      desc: 'Predict your future self with AI growth modeling',
      path: '/skilltwin',
      color: 'from-cyan to-cyan-glow'
    },
    { 
      icon: Map, 
      title: 'Career Roadmap', 
      desc: 'Get personalized learning paths and milestones',
      path: '/career-roadmap',
      color: 'from-primary to-cyan'
    },
    { 
      icon: Users, 
      title: 'Mentor Matching', 
      desc: 'Connect with industry experts matched to your goals',
      path: '/mentor-matching',
      color: 'from-purple-glow to-primary'
    },
    { 
      icon: GraduationCap, 
      title: 'Alumni Directory', 
      desc: 'Connect with successful alumni from your institution',
      path: '/alumni',
      color: 'from-cyan to-purple-glow'
    },
    { 
      icon: Video, 
      title: 'Global Webinars', 
      desc: 'AI-dubbed content in your preferred language',
      path: '/webinars',
      color: 'from-cyan to-primary'
    },
    { 
      icon: Heart, 
      title: 'Wellbeing Agent', 
      desc: 'Monitor burnout and get wellness suggestions',
      path: '/wellbeing',
      color: 'from-primary to-destructive'
    },
    { 
      icon: Wifi, 
      title: 'SkillScanner', 
      desc: 'Offline skill extraction from documents',
      path: '/skillscanner',
      color: 'from-cyan-glow to-cyan'
    },
    { 
      icon: Building, 
      title: 'University Insights', 
      desc: 'Analytics dashboard for skill trends',
      path: '/university-insights',
      color: 'from-primary to-purple-glow'
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {isNewSignup ? 'Welcome, ' : 'Welcome back, '}{userName || 'Student'}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Skill Score', value: '847', change: '+12' },
            { label: 'Skills Verified', value: '23', change: '+3' },
            { label: 'Mentor Sessions', value: '8', change: '+2' },
            { label: 'Roadmap Progress', value: '67%', change: '+5%' },
          ].map((stat, index) => (
            <Card key={index} variant="glass" className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-display gradient-text">{stat.value}</span>
                <span className="text-xs text-cyan">↑ {stat.change}</span>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Alumni Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card variant="glow" className="p-6 border-2 border-cyan/30 bg-gradient-to-br from-primary/5 to-cyan/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                <Users className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display">Find Alumni</h2>
                <p className="text-xs text-muted-foreground">Search by name, company, or passout year</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search alumni by name, companies, and passout year..."
                  value={alumniSearchQuery}
                  onChange={(e) => setAlumniSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAlumniSearch()}
                  className="pl-10 h-12 text-base border-cyan/50 focus:border-cyan bg-background"
                />
              </div>
              <Button 
                onClick={handleAlumniSearch}
                className="h-12 px-6 bg-gradient-to-r from-primary to-cyan hover:opacity-90"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Feature Cards */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.08}>
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  variant="feature" 
                  className="h-full cursor-pointer group"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:shadow-[0_0_30px_hsl(262,83%,58%/0.4)] transition-shadow`}>
                      <feature.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {feature.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          
        </motion.footer>
      </div>
    </div>
  );
};
