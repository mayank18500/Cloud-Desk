import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/layouts/MainLayout";

// Pages
import Register from "@/pages/Regiser";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/NotFound";

// Company Pages
import CompanyDashboard from "@/pages/company/CompanyDashboard";
import Marketplace from "@/pages/company/Marketplace";
import SessionReport from "@/pages/company/SessionReport";

// Interviewer Pages
import InterviewerDashboard from "@/pages/interviewer/InterviewerDashboard";
import EditProfile from "@/pages/interviewer/EditProfile";
import Wallet from "@/pages/interviewer/Wallet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/register" element={<Register />} />
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            {/* Protected routes with MainLayout */}
            <Route element={<MainLayout />}>
              {/* Company routes */}
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/hire" element={<Marketplace />} />
              <Route path="/company/history" element={<SessionReport />} />
              
              {/* Interviewer routes */}
              <Route path="/interviewer/dashboard" element={<InterviewerDashboard />} />
              <Route path="/interviewer/profile" element={<EditProfile />} />
              <Route path="/interviewer/wallet" element={<Wallet />} />
              
              {/* Root redirect - handled by MainLayout */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
