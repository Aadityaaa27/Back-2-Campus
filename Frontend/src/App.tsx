import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { SkillEvaluationPage } from "./pages/SkillEvaluationPage";
import { SkillTwinPage } from "./pages/SkillTwinPage";
import { CareerRoadmapPage } from "./pages/CareerRoadmapPage";
import { MentorMatchingPage } from "./pages/MentorMatchingPage";
import { WebinarsPage } from "./pages/WebinarsPage";
import { WellbeingPage } from "./pages/WellbeingPage";
import { SkillScannerPage } from "./pages/SkillScannerPage";
import { UniversityInsightsPage } from "./pages/UniversityInsightsPage";
import { MentorDashboard } from "./pages/MentorDashboard";
import { AlumniDashboard } from "./pages/AlumniDashboard";
import { AlumniListDashboard } from "./pages/AlumniListDashboard";
import { StudentsFromAlumniDashboard } from "./pages/StudentsFromAlumniDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AnimatedBackground />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/skill-evaluation" element={<SkillEvaluationPage />} />
            <Route path="/skilltwin" element={<SkillTwinPage />} />
            <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
            <Route path="/mentor-matching" element={<MentorMatchingPage />} />
            <Route path="/webinars" element={<WebinarsPage />} />
            <Route path="/wellbeing" element={<WellbeingPage />} />
            <Route path="/skillscanner" element={<SkillScannerPage />} />
            <Route path="/university-insights" element={<UniversityInsightsPage />} />
            <Route path="/mentor" element={<MentorDashboard />} />
            <Route path="/alumni" element={<AlumniDashboard />} />
            <Route path="/alumni/list" element={<AlumniListDashboard />} />
            <Route path="/alumni/students" element={<StudentsFromAlumniDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
