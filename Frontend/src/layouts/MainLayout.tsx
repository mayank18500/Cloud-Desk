import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/shared/Navbar';
import { Sidebar } from '../components/shared/Sidebar';
import { PageLoader } from '../components/shared/Loader';

export function MainLayout() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  // 🚫 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow onboarding page itself
  if (location.pathname === '/onboarding') {
    return <Outlet />;
  }

  // 🚀 Logged in but role not chosen → onboarding
  if (!role) {
    return <Navigate to="/onboarding" replace />;
  }

  // 🏠 Redirect root to dashboard
  if (location.pathname === '/') {
    return (
      <Navigate
        to={
          role === 'company'
            ? '/company/dashboard'
            : '/interviewer/dashboard'
        }
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 py-8 md:px-10 lg:px-12 w-full">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
