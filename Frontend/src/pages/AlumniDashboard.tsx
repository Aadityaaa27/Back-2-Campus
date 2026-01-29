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
  ChevronDown,
  MapPin,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

// Alumni mock data
const ALUMNI_DATA = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Google Inc.',
    position: 'Senior Software Engineer',
    batch: 2020,
    location: 'Mountain View, CA',
    branch: 'Computer Science',
    skills: ['System Design', 'Leadership', 'Cloud Architecture'],
    avatar: '👨‍💼',
    bio: 'Passionate about building scalable systems'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    company: 'Microsoft',
    position: 'Product Manager',
    batch: 2019,
    location: 'Seattle, WA',
    branch: 'Business Administration',
    skills: ['React', 'Team Building', 'Career Growth'],
    avatar: '👩‍💼',
    bio: 'Helps developers grow their careers'
  },
  {
    id: 3,
    name: 'Emily Davis',
    company: 'Apple',
    position: 'UX Designer',
    batch: 2021,
    location: 'Austin, TX',
    branch: 'Data Science',
    skills: ['ML/AI', 'Python', 'Research'],
    avatar: '👩‍💼',
    bio: 'AI research and ML infrastructure'
  },
  {
    id: 4,
    name: 'Rahul Singh',
    company: 'Amazon',
    position: 'Senior Software Engineer',
    batch: 2020,
    location: 'Bangalore, India',
    branch: 'Computer Science',
    skills: ['AWS', 'Node.js', 'Database Design'],
    avatar: '👨‍💼',
    bio: 'Cloud infrastructure specialist'
  },
  {
    id: 5,
    name: 'Neha Verma',
    company: 'Apple',
    position: 'Product Engineer',
    batch: 2019,
    location: 'Cupertino, CA',
    branch: 'Computer Science',
    skills: ['iOS Development', 'Swift', 'UI/UX'],
    avatar: '👩‍💼',
    bio: 'Mobile app development expert'
  },
  {
    id: 6,
    name: 'Vikram Reddy',
    company: 'Goldman Sachs',
    position: 'Senior Quantitative Developer',
    batch: 2018,
    location: 'New York, NY',
    branch: 'Computer Science',
    skills: ['Financial Systems', 'C++', 'Low Latency'],
    avatar: '👨‍💼',
    bio: 'High-frequency trading systems'
  },
];

export const AlumniDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // Check if there's a search query from navigation state
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  // Get unique batches, companies, and locations from data
  const uniqueBatches = [...new Set(ALUMNI_DATA.map(a => a.batch))].sort((a, b) => b - a);
  const uniqueCompanies = [...new Set(ALUMNI_DATA.map(a => a.company))].sort();
  const uniqueLocations = [...new Set(ALUMNI_DATA.map(a => a.location))].sort();

  // Filter alumni based on search and dropdown filters
  const filteredAlumni = useMemo(() => {
    return ALUMNI_DATA.filter(alumni => {
      const searchLower = searchQuery.toLowerCase();
      
      // Search across name, company, location, and skills
      const matchesSearch = 
        alumni.name.toLowerCase().includes(searchLower) ||
        alumni.company.toLowerCase().includes(searchLower) ||
        alumni.location.toLowerCase().includes(searchLower) ||
        alumni.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        alumni.position.toLowerCase().includes(searchLower);

      // Apply batch filter
      const matchesBatch = !selectedBatch || alumni.batch.toString() === selectedBatch;

      // Apply company filter
      const matchesCompany = !selectedCompany || alumni.company === selectedCompany;

      // Apply location filter
      const matchesLocation = !selectedLocation || alumni.location === selectedLocation;

      return matchesSearch && matchesBatch && matchesCompany && matchesLocation;
    });
  }, [searchQuery, selectedBatch, selectedCompany, selectedLocation]);

  const handleConnect = (alumniName: string) => {
    toast.success(`Connection request sent to ${alumniName}!`, {
      description: 'They will receive your request shortly.',
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/student')}
                className="text-primary hover:text-primary/80"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-semibold text-lg">Back to Campus</span>
              </Button>
            </div>
            <Button 
              variant="ghost"
              onClick={() => setShowMenu(!showMenu)}
              className="relative"
            >
              <Menu className="w-6 h-6" />
              Menu
            </Button>
          </div>

          {/* Menu Sidebar */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="fixed right-4 top-20 bg-card border border-border rounded-lg p-4 shadow-lg z-50 w-64"
            >
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  🏠 HOME
                </button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  👥 ALUMNI
                </button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  📍 LOCATION
                </button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  🎓 BATCH
                </button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  🏢 COMPANY
                </button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  📨 REQUEST
                </button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  👤 PROFILE
                </button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary flex items-center gap-2">
                  📄 RESUME
                </button>
              </div>
            </motion.div>
          )}
        </FadeIn>

        {/* Title Section */}
        <FadeIn delay={0.1}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-display mb-2">Alumni Directory</h1>
            <p className="text-muted-foreground">Browse and connect with alumni from your college</p>
          </div>
        </FadeIn>

        {/* Search and Filter Section */}
        <FadeIn delay={0.2}>
          <div className="mb-8 bg-card border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search alumni, companies, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              {/* All Batches Dropdown */}
              <div>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">All Batches</option>
                  {uniqueBatches.map(batch => (
                    <option key={batch} value={batch}>Batch {batch}</option>
                  ))}
                </select>
              </div>

              {/* All Companies Dropdown */}
              <div>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">All Companies</option>
                  {uniqueCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              {/* All Locations Dropdown */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Alumni Cards Grid */}
        {filteredAlumni.length > 0 ? (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <StaggerItem key={alumni.id}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card variant="glow" className="p-6 h-full flex flex-col bg-card border-2 border-border hover:border-primary/50 transition-all">
                    {/* Avatar and Connect Button */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-3xl">
                        {alumni.avatar}
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleConnect(alumni.name)}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        Connect
                      </Button>
                    </div>

                    {/* Name and Position */}
                    <h3 className="text-xl font-bold font-display mb-1">{alumni.name}</h3>
                    <p className="text-sm font-semibold text-primary mb-1">{alumni.position}</p>
                    <p className="text-sm text-muted-foreground mb-2">{alumni.company}</p>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Batch: {alumni.batch}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Location: {alumni.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>Branch: {alumni.branch}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {alumni.skills.slice(0, 3).map((skill, idx) => (
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
            <Card variant="glass" className="p-12 text-center">
              <div className="text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium mb-2">No alumni found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Quick Navigation Buttons (Moved to bottom) */}
        <FadeIn delay={0.3}>
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            <Card variant="glow" className="p-6 border-2 border-cyan/30 cursor-pointer hover:border-cyan/60 transition-colors" onClick={() => navigate('/alumni/list')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                  <Users className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Connect to Peer Alumni</h3>
                  <p className="text-sm text-muted-foreground">Network with fellow alumni</p>
                </div>
              </div>
            </Card>

            <Card variant="glow" className="p-6 border-2 border-purple-glow/30 cursor-pointer hover:border-purple-glow/60 transition-colors" onClick={() => navigate('/alumni/students')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-glow to-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Mentor Students</h3>
                  <p className="text-sm text-muted-foreground">Guide talented students</p>
                </div>
              </div>
            </Card>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
