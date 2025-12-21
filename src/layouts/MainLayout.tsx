import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';
import { PageLoader } from '@/components/shared/Loader';

export function MainLayout() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if no role is set
  if (!role) {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to correct dashboard based on role
  if (location.pathname === '/') {
    return <Navigate to={role === 'company' ? '/company/dashboard' : '/interviewer/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
