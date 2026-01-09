import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./layouts/MainLayout";

// Pages
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

// Company Pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Marketplace from "./pages/company/Marketplace";
import SessionReport from "./pages/company/SessionReport";
import PostJob from "./pages/company/PostJob";

// Interviewer Pages
import InterviewerDashboard from "./pages/interviewer/InterviewerDashboard";
import EditProfile from "./pages/interviewer/EditProfile";
import JobBoard from "./pages/interviewer/JobBoard";

import ChatPage from "./pages/chatPage";

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
              <Route path="/company/jobs" element={<PostJob />} />

              {/* Interviewer routes */}
              <Route path="/interviewer/dashboard" element={<InterviewerDashboard />} />
              <Route path="/interviewer/profile" element={<EditProfile />} />
              <Route path="/interviewer/jobs" element={<JobBoard />} />

              <Route path="/chat" element={<ChatPage />} />

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
