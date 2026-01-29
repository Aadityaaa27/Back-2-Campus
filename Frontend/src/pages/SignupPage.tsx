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

export const SignupPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    year: '',
    collegeName: '',
    subjectToDiscuss: '',
    passedYear: '',
    replySection: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);

    try {
      if (selectedRole === 'student') {
        if (!formData.name || !formData.year || !formData.collegeName || !formData.subjectToDiscuss) {
          toast.error('Please fill all student fields');
          setIsLoading(false);
          return;
        }

        const response = await authAPI.signupStudent({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          college_name: formData.collegeName,
          current_year: formData.year,
          subject_to_discuss: formData.subjectToDiscuss,
        });

        toast.success('Account created! Welcome, ' + formData.name + '!');
        localStorage.setItem('userName', formData.name);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('isNewSignup', 'true');
        
        // Auto login after signup
        const loginResponse = await authAPI.loginStudent(formData.email, formData.password);
        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('role', loginResponse.role);
        
        navigate('/student');
      } else if (selectedRole === 'mentor') {
        if (!formData.name || !formData.passedYear || !formData.replySection) {
          toast.error('Please fill all mentor fields');
          setIsLoading(false);
          return;
        }

        // Parse expertise from replySection (comma-separated)
        const expertise = formData.replySection.split(',').map(s => s.trim()).filter(s => s);

        const response = await authAPI.signupMentor({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          passedYear: parseInt(formData.passedYear) || 0,
          expertise: expertise,
        });

        toast.success('Account created! Welcome, Mentor ' + formData.name + '!');
        localStorage.setItem('userName', formData.name);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('isNewSignup', 'true');
        
        // Auto login after signup
        const loginResponse = await authAPI.loginMentor(formData.email, formData.password);
        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('role', loginResponse.role);
        
        navigate('/mentor');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      // Better error message for timeout
      if (errorMessage.includes('timeout') || errorMessage.includes('Network Error')) {
        toast.error('Server is slow or not responding. Please try again in a moment.');
      } else {
        toast.error(errorMessage);
      }
      
      console.error('Signup error:', error);
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
                <h2 className="text-2xl font-bold font-display text-center mb-2">Create Account</h2>
                <p className="text-muted-foreground text-center mb-8">Choose your role to get started</p>

                <div className="space-y-4">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full group"
                    onClick={() => setSelectedRole('student')}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Sign up as Student
                    <ArrowRight className="ml-auto w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full group"
                    onClick={() => setSelectedRole('mentor')}
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Sign up as Mentor
                    <ArrowRight className="ml-auto w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center mt-6">
                  Already have an account?{' '}
                  <button 
                    onClick={() => navigate('/login')} 
                    className="text-primary hover:underline"
                  >
                    Login
                  </button>
                </p>
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
                <h2 className="text-2xl font-bold font-display text-center mb-6">Student Registration</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="year">Current Year</Label>
                  <Input
                    id="year"
                    name="year"
                    placeholder="e.g., 2nd Year"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input
                    id="collegeName"
                    name="collegeName"
                    placeholder="Enter your college name"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectToDiscuss">Subject to Discuss</Label>
                  <Input
                    id="subjectToDiscuss"
                    name="subjectToDiscuss"
                    placeholder="e.g., Machine Learning, Web Dev"
                    value={formData.subjectToDiscuss}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full mt-6">
                  Create Account
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
                <h2 className="text-2xl font-bold font-display text-center mb-6">Mentor Registration</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="passedYear">Passed Year</Label>
                  <Input
                    id="passedYear"
                    name="passedYear"
                    placeholder="e.g., 2020"
                    value={formData.passedYear}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="replySection">Expertise / Reply Section</Label>
                  <Input
                    id="replySection"
                    name="replySection"
                    placeholder="e.g., React, Cloud Computing, AI/ML"
                    value={formData.replySection}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full mt-6">
                  Create Account
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
