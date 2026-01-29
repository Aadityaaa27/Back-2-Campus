import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { SkillChip } from '@/components/ui/skill-chip';
import { ArrowLeft, Users, Briefcase, Star, MessageSquare, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

export const MentorMatchingPage = () => {
  const navigate = useNavigate();
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const mentors = [
    {
      name: 'Sanjay Chatterjee',
      company: 'Google',
      role: 'Senior Staff Engineer',
      skills: ['System Design', 'Leadership', 'Cloud Architecture'],
      matchScore: 94,
      avatar: 'SC',
    },
    {
      name: 'Aakash kumar',
      company: 'Meta',
      role: 'Engineering Manager',
      skills: ['React', 'Team Building', 'Career Growth'],
      matchScore: 89,
      avatar: 'MJ',
    },
    {
      name: 'Dr. Priya Patel',
      company: 'Microsoft',
      role: 'Principal Engineer',
      skills: ['ML/AI', 'Python', 'Research'],
      matchScore: 87,
      avatar: 'PP',
    },
  ];

  const handleConnect = (mentorName: string) => {
    if (sentRequests.includes(mentorName)) {
      toast.info(`You already sent a request to ${mentorName}`, {
        description: 'Waiting for their response...',
      });
      return;
    }

    setSentRequests([...sentRequests, mentorName]);
    toast.success(`Request sent to ${mentorName}!`, {
      description: 'They will respond within 24-48 hours. Check your messages for updates.',
      duration: 4000,
    });
  };

  const handleWithdraw = (mentorName: string) => {
    setSentRequests(sentRequests.filter(name => name !== mentorName));
    toast.info(`Request withdrawn from ${mentorName}`, {
      description: 'You can send a new request anytime.',
    });
  };

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-glow to-primary flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Mentor Matching</h1>
            <p className="text-muted-foreground">AI-matched mentors aligned to your career goals</p>
          </div>
        </FadeIn>

        {/* Mentor Cards */}
        <StaggerContainer staggerDelay={0.15}>
          {mentors.map((mentor, index) => (
            <StaggerItem key={mentor.name}>
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
              >
                <Card variant="glass" className="p-6 mb-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-2xl font-bold font-display">
                        {mentor.avatar}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold font-display">{mentor.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            <span>{mentor.role}</span>
                            <span className="text-border">•</span>
                            <span className="text-cyan">{mentor.company}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-cyan/20 border border-primary/30">
                          <Star className="w-4 h-4 text-cyan" />
                          <span className="text-sm font-bold gradient-text">{mentor.matchScore}% Match</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.skills.map((skill) => (
                          <SkillChip key={skill} skill={skill} variant="default" />
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant={sentRequests.includes(mentor.name) ? "outline" : "gradient"}
                          size="sm"
                          onClick={() => handleConnect(mentor.name)}
                          disabled={sentRequests.includes(mentor.name)}
                        >
                          {sentRequests.includes(mentor.name) ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                        
                        {sentRequests.includes(mentor.name) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleWithdraw(mentor.name)}
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Footer Note removed as requested */}
      </div>
    </div>
  );
};
