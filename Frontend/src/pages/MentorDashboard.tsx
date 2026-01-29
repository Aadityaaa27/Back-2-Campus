import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { SkillChip } from '@/components/ui/skill-chip';
import { 
  ArrowLeft, 
  Briefcase, 
  LogOut, 
  Users, 
  CheckCircle, 
  Clock,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const MentorDashboard = () => {
  const [userName, setUserName] = useState('');
  const [isNewSignup, setIsNewSignup] = useState(false);
  
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

  const initialIncomingRequests = [
    { id: 1, name: 'Rohan', skill: 'React.js', time: '2 hours ago' },
    { id: 2, name: 'Maya Patel', skill: 'System Design', time: '5 hours ago' },
    { id: 3, name: 'Abhishek', skill: 'Career Advice', time: 'Yesterday' },
  ];

  const initialAcceptedSessions = [
    { id: 101, name: 'Jagdish', topic: 'ML Interview Prep', date: 'Tomorrow, 3 PM', status: 'confirmed' },
    { id: 102, name: 'Priya Patel', topic: 'Portfolio Review', date: 'Friday, 10 AM', status: 'confirmed' },
  ];

  const [incomingRequests, setIncomingRequests] = useState(initialIncomingRequests);
  const [acceptedSessions, setAcceptedSessions] = useState(initialAcceptedSessions);

  const expertiseTags = [
    'System Design', 'React', 'Cloud Architecture', 'Leadership', 
    'Technical Interviews', 'Career Growth'
  ];

  const handleAccept = (requestId: number, requestName: string, requestSkill: string) => {
    // Find the request
    const request = incomingRequests.find(r => r.id === requestId);
    if (!request) return;

    // Create new accepted session from the request
    const newSession = {
      id: Date.now(), // unique id
      name: request.name,
      topic: `${request.skill} Mentoring`,
      date: 'Scheduled',
      status: 'confirmed'
    };

    // Add to accepted sessions
    setAcceptedSessions([...acceptedSessions, newSession]);

    // Remove from incoming requests
    setIncomingRequests(incomingRequests.filter(r => r.id !== requestId));

    toast.success(`Session with ${requestName} accepted!`, {
      description: 'They will receive a calendar invite shortly.',
    });
  };

  const handleDecline = (requestId: number, requestName: string) => {
    setIncomingRequests(incomingRequests.filter(r => r.id !== requestId));
    toast.info(`Request from ${requestName} declined`);
  };

  const handleRejectSession = (sessionId: number, sessionName: string) => {
    setAcceptedSessions(acceptedSessions.filter(s => s.id !== sessionId));
    toast.info(`Session with ${sessionName} rejected`, {
      description: 'They will be notified of the cancellation.',
    });
  };

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      {/* Animated blue/purple background blobs */}
      <div className="animated-bg pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-glow to-primary flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Mentor Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {isNewSignup ? 'Welcome, ' : 'Welcome back, '}{userName || 'Mentor'}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Stats */}
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Sessions', value: '47', icon: Calendar },
              { label: 'Students Helped', value: '32', icon: Users },
              { label: 'Avg Rating', value: '4.9', icon: Award },
              { label: 'Hours Mentored', value: '68', icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-cyan" />
                  </div>
                  <p className="text-2xl font-bold font-display gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Incoming Requests */}
          <FadeIn delay={0.2}>
            <Card variant="glass" className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan" />
                  Incoming Requests
                  <span className="ml-auto text-sm px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {incomingRequests.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {incomingRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Wants help with <span className="text-cyan">{request.skill}</span>
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{request.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="gradient" 
                        size="sm"
                        onClick={() => handleAccept(request.id, request.name, request.skill)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDecline(request.id, request.name)}
                      >
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Accepted Sessions */}
          <FadeIn delay={0.3}>
            <Card variant="glass" className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Accepted Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {acceptedSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/30 border border-cyan/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{session.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan/20 text-cyan inline-block mt-1">
                          {session.status}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRejectSession(session.id, session.name)}
                      >
                        Reject
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{session.topic}</p>
                    <p className="text-xs text-cyan flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {session.date}
                    </p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Expertise Tags */}
        <FadeIn delay={0.5}>
          <Card variant="glow" className="p-6 mt-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan" />
                Your Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2">
                {expertiseTags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <SkillChip skill={tag} variant="glow" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

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
