import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { SkillChip } from '@/components/ui/skill-chip';
import { 
  ArrowLeft, 
  Search, 
  Users,
  GraduationCap,
  Award,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

// Students mock data
const STUDENTS_DATA = [
  {
    id: 1,
    name: 'Aman Sharma',
    branch: 'Computer Science',
    year: 4,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    avatar: 'AS',
    bio: 'Full-stack developer aspiring to work at FAANG'
  },
  {
    id: 2,
    name: 'Sneha Gupta',
    branch: 'Information Technology',
    year: 3,
    skills: ['Python', 'Data Science', 'Machine Learning', 'TensorFlow'],
    avatar: 'SG',
    bio: 'ML enthusiast exploring AI applications'
  },
  {
    id: 3,
    name: 'Rohan Patel',
    branch: 'Computer Science',
    year: 2,
    skills: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
    avatar: 'RP',
    bio: 'Backend development specialist'
  },
  {
    id: 4,
    name: 'Priya Singh',
    branch: 'Electronics & Communication',
    year: 4,
    skills: ['IoT', 'Embedded Systems', 'C++', 'FPGA'],
    avatar: 'PS',
    bio: 'Hardware and IoT enthusiast'
  },
  {
    id: 5,
    name: 'Vikram Joshi',
    branch: 'Computer Science',
    year: 3,
    skills: ['React Native', 'Flutter', 'JavaScript', 'TypeScript'],
    avatar: 'VJ',
    bio: 'Mobile app development expert'
  },
  {
    id: 6,
    name: 'Divya Nair',
    branch: 'Information Technology',
    year: 2,
    skills: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
    avatar: 'DN',
    bio: 'Cloud infrastructure enthusiast'
  },
  {
    id: 7,
    name: 'Arjun Verma',
    branch: 'Computer Science',
    year: 4,
    skills: ['System Design', 'Algorithms', 'DSA', 'Competitive Programming'],
    avatar: 'AV',
    bio: 'Passionate about problem-solving'
  },
  {
    id: 8,
    name: 'Meera Iyer',
    branch: 'Computer Science',
    year: 3,
    skills: ['UI/UX Design', 'Figma', 'Web Design', 'User Research'],
    avatar: 'MI',
    bio: 'Product designer focusing on user experience'
  },
];

export const StudentsFromAlumniDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedYearFilter, setExpandedYearFilter] = useState(false);
  const [expandedBranchFilter, setExpandedBranchFilter] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  // Get unique years and branches from data
  const uniqueYears = [...new Set(STUDENTS_DATA.map(s => s.year))].sort((a, b) => b - a);
  const uniqueBranches = [...new Set(STUDENTS_DATA.map(s => s.branch))].sort();

  // Filter students based on search and dropdown filters
  const filteredStudents = useMemo(() => {
    return STUDENTS_DATA.filter(student => {
      const searchLower = searchQuery.toLowerCase();
      
      const matchesSearch = 
        student.name.toLowerCase().includes(searchLower) ||
        student.branch.toLowerCase().includes(searchLower) ||
        student.year.toString().includes(searchLower) ||
        student.skills.some(skill => skill.toLowerCase().includes(searchLower));

      // Apply year filter
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(student.year);

      // Apply branch filter
      const matchesBranch = selectedBranches.length === 0 || selectedBranches.includes(student.branch);

      return matchesSearch && matchesYear && matchesBranch;
    });
  }, [searchQuery, selectedYears, selectedBranches]);

  const handleYearToggle = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const handleBranchToggle = (branch: string) => {
    setSelectedBranches(prev =>
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
  };

  const handleMentor = (studentName: string) => {
    toast.success(`Mentor request sent to ${studentName}!`, {
      description: 'You will be connected soon.',
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/alumni')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Alumni Dashboard
          </Button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-glow flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Students Dashboard</h1>
            <p className="text-muted-foreground">Meet talented students and offer mentorship</p>
          </div>
        </FadeIn>

        {/* Search Section */}
        <FadeIn delay={0.1}>
          <Card variant="glow" className="p-6 mb-8 border-2 border-purple-glow/30">
            <div className="space-y-4">
              {/* Global Search Bar */}
              <div>
                <label className="text-sm font-semibold text-cyan mb-3 block">🔍 Global Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-cyan" />
                  <Input
                    placeholder="Search students by name, branch, year, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 text-base bg-secondary/40 border-purple-glow/50 focus:border-purple-glow"
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div>
                <label className="text-sm font-semibold text-cyan mb-3 block">⚙️ Optional Filters</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Year Filter */}
                  <div>
                    <button
                      onClick={() => setExpandedYearFilter(!expandedYearFilter)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-cyan" />
                        <span className="text-sm font-medium">
                          Year {selectedYears.length > 0 && `(${selectedYears.length})`}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedYearFilter ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedYearFilter && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-3 bg-secondary/30 rounded-lg space-y-2"
                      >
                        {uniqueYears.map(year => (
                          <label key={year} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedYears.includes(year)}
                              onChange={() => handleYearToggle(year)}
                              className="rounded w-4 h-4"
                            />
                            <span className="text-sm">Year {year}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Branch Filter */}
                  <div>
                    <button
                      onClick={() => setExpandedBranchFilter(!expandedBranchFilter)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan" />
                        <span className="text-sm font-medium">
                          Branch {selectedBranches.length > 0 && `(${selectedBranches.length})`}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedBranchFilter ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedBranchFilter && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-3 bg-secondary/30 rounded-lg space-y-2 max-h-48 overflow-y-auto"
                      >
                        {uniqueBranches.map(branch => (
                          <label key={branch} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBranches.includes(branch)}
                              onChange={() => handleBranchToggle(branch)}
                              className="rounded w-4 h-4"
                            />
                            <span className="text-sm">{branch}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Results Count */}
        <FadeIn delay={0.15}>
          <div className="flex items-center justify-between mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-semibold text-cyan">
              📊 Results: {filteredStudents.length} of {STUDENTS_DATA.length} students
            </p>
            {searchQuery && (
              <p className="text-xs text-muted-foreground">
                Search: "{searchQuery}"
              </p>
            )}
          </div>
        </FadeIn>

        {/* Students Cards Grid */}
        {filteredStudents.length > 0 ? (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <StaggerItem key={student.id}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card variant="glow" className="p-6 h-full flex flex-col">
                    {/* Avatar and Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-glow flex items-center justify-center font-bold text-foreground">
                        {student.avatar}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMentor(student.name)}
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Mentor
                      </Button>
                    </div>

                    {/* Name and Details */}
                    <h3 className="text-lg font-bold font-display mb-1">{student.name}</h3>
                    <p className="text-sm text-cyan mb-1">{student.branch}</p>
                    <p className="text-xs text-muted-foreground mb-3">Year {student.year}</p>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{student.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map((skill, idx) => (
                        <SkillChip key={idx} skill={skill} />
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeIn>
            <Card variant="glass" className="p-8 text-center">
              <div className="text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No students found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            </Card>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
