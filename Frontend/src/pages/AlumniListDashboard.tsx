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
  Briefcase,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

// Alumni mock data (for peer connections)
const ALUMNI_DATA = [
  {
    id: 1,
    name: 'Sanjay Chatterjee',
    company: 'Google',
    position: 'Senior Staff Engineer',
    passingYear: 2018,
    skills: ['System Design', 'Leadership', 'Cloud Architecture'],
    avatar: 'SC',
    bio: 'Passionate about building scalable systems'
  },
  {
    id: 2,
    name: 'Aakash Kumar',
    company: 'Meta',
    position: 'Engineering Manager',
    passingYear: 2019,
    skills: ['React', 'Team Building', 'Career Growth'],
    avatar: 'AK',
    bio: 'Helps developers grow their careers'
  },
  {
    id: 3,
    name: 'Priya Patel',
    company: 'Microsoft',
    position: 'Principal Engineer',
    passingYear: 2017,
    skills: ['ML/AI', 'Python', 'Research'],
    avatar: 'PP',
    bio: 'AI research and ML infrastructure'
  },
  {
    id: 4,
    name: 'Rahul Singh',
    company: 'Amazon',
    position: 'Senior Software Engineer',
    passingYear: 2020,
    skills: ['AWS', 'Node.js', 'Database Design'],
    avatar: 'RS',
    bio: 'Cloud infrastructure specialist'
  },
  {
    id: 5,
    name: 'Neha Verma',
    company: 'Apple',
    position: 'Product Engineer',
    passingYear: 2019,
    skills: ['iOS Development', 'Swift', 'UI/UX'],
    avatar: 'NV',
    bio: 'Mobile app development expert'
  },
  {
    id: 6,
    name: 'Vikram Reddy',
    company: 'Goldman Sachs',
    position: 'Senior Quantitative Developer',
    passingYear: 2018,
    skills: ['Financial Systems', 'C++', 'Low Latency'],
    avatar: 'VR',
    bio: 'High-frequency trading systems'
  },
];

export const AlumniListDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedYearFilter, setExpandedYearFilter] = useState(false);
  const [expandedCompanyFilter, setExpandedCompanyFilter] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Get unique years and companies from data
  const uniqueYears = [...new Set(ALUMNI_DATA.map(a => a.passingYear))].sort((a, b) => b - a);
  const uniqueCompanies = [...new Set(ALUMNI_DATA.map(a => a.company))].sort();

  // Filter alumni based on search and dropdown filters
  const filteredAlumni = useMemo(() => {
    return ALUMNI_DATA.filter(alumni => {
      const searchLower = searchQuery.toLowerCase();
      
      // Search across name, company, passing year, and skills
      const matchesSearch = 
        alumni.name.toLowerCase().includes(searchLower) ||
        alumni.company.toLowerCase().includes(searchLower) ||
        alumni.passingYear.toString().includes(searchLower) ||
        alumni.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        alumni.position.toLowerCase().includes(searchLower);

      // Apply year filter
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(alumni.passingYear);

      // Apply company filter
      const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.includes(alumni.company);

      return matchesSearch && matchesYear && matchesCompany;
    });
  }, [searchQuery, selectedYears, selectedCompanies]);

  const handleYearToggle = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const handleCompanyToggle = (company: string) => {
    setSelectedCompanies(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const handleConnect = (alumniName: string) => {
    toast.success(`Connection request sent to ${alumniName}!`, {
      description: 'They will receive your request shortly.',
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Connect to Peer Alumni</h1>
            <p className="text-muted-foreground">Network with fellow alumni from your institution</p>
          </div>
        </FadeIn>

        {/* Search and Filter Section */}
        <FadeIn delay={0.1}>
          <Card variant="glow" className="p-6 mb-8 border-2 border-cyan/30">
            <div className="space-y-4">
              {/* Global Search Bar */}
              <div>
                <label className="text-sm font-semibold text-cyan mb-3 block">🔍 Global Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-cyan" />
                  <Input
                    placeholder="Search alumni by name, company, year, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 text-base bg-secondary/40 border-cyan/50 focus:border-cyan"
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
                      <Calendar className="w-4 h-4 text-cyan" />
                      <span className="text-sm font-medium">
                        Passing Year {selectedYears.length > 0 && `(${selectedYears.length})`}
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
                          <span className="text-sm">{year}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Company Filter */}
                <div>
                  <button
                    onClick={() => setExpandedCompanyFilter(!expandedCompanyFilter)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan" />
                      <span className="text-sm font-medium">
                        Company {selectedCompanies.length > 0 && `(${selectedCompanies.length})`}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedCompanyFilter ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedCompanyFilter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-3 bg-secondary/30 rounded-lg space-y-2 max-h-48 overflow-y-auto"
                    >
                      {uniqueCompanies.map(company => (
                        <label key={company} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company)}
                            onChange={() => handleCompanyToggle(company)}
                            className="rounded w-4 h-4"
                          />
                          <span className="text-sm">{company}</span>
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
              📊 Results: {filteredAlumni.length} of {ALUMNI_DATA.length} alumni
            </p>
            {searchQuery && (
              <p className="text-xs text-muted-foreground">
                Search: "{searchQuery}"
              </p>
            )}
          </div>
        </FadeIn>

        {/* Alumni Cards Grid */}
        {filteredAlumni.length > 0 ? (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map((alumni) => (
              <StaggerItem key={alumni.id}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card variant="glow" className="p-6 h-full flex flex-col">
                    {/* Avatar and Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center font-bold text-foreground">
                        {alumni.avatar}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnect(alumni.name)}
                      >
                        Connect
                      </Button>
                    </div>

                    {/* Name and Position */}
                    <h3 className="text-lg font-bold font-display mb-1">{alumni.name}</h3>
                    <p className="text-sm text-cyan mb-1">{alumni.position}</p>
                    <p className="text-xs text-muted-foreground mb-4">{alumni.company}</p>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{alumni.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {alumni.skills.map((skill, idx) => (
                        <SkillChip key={idx} skill={skill} />
                      ))}
                    </div>

                    {/* Passing Year */}
                    <div className="text-xs text-muted-foreground">
                      Passed: {alumni.passingYear}
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
                <p className="text-lg font-medium">No alumni found</p>
                <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
              </div>
            </Card>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
