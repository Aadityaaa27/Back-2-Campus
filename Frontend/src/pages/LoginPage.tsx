import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FadeIn } from '@/components/animations/PageTransition';
import { GraduationCap, User, Briefcase, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI, handleApiError } from '@/services/api';

type Role = 'student' | 'mentor' | null;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (selectedRole === 'student') {
        response = await authAPI.loginStudent(formData.email, formData.password);
      } else {
        response = await authAPI.loginMentor(formData.email, formData.password);
      }

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('userEmail', formData.email);

      toast.success(`Welcome back, ${selectedRole === 'student' ? 'Student' : 'Mentor'}!`);

      // Navigate to appropriate dashboard
      if (response.role === 'student') {
        navigate('/student');
      } else {
        navigate('/mentor');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-md">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => selectedRole ? setSelectedRole(null) : navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {selectedRole ? 'Back to Role Selection' : 'Back to Home'}
        </Button>

        <Card variant="glass" className="p-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-foreground" />
            </div>
            <span className="text-2xl font-bold font-display gradient-text">Back-2-Campus</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold font-display text-center mb-2">Welcome Back</h2>
                <p className="text-muted-foreground text-center mb-8">Choose how you want to continue</p>

                <div className="space-y-4">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full group"
                    onClick={() => setSelectedRole('student')}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Continue as Student
                    <ArrowRight className="ml-auto w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full group"
                    onClick={() => setSelectedRole('mentor')}
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Continue as Mentor
                    <ArrowRight className="ml-auto w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            ) : selectedRole === 'student' ? (
              <motion.form
                key="student-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold font-display text-center mb-6">Student Login</h2>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full mt-6">
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="mentor-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold font-display text-center mb-6">Mentor Login</h2>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full mt-6">
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-border/50"
          >
            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </Card>
      </FadeIn>
    </div>
  );
};
