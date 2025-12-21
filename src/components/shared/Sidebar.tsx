import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  History,
  UserCog,
  Wallet,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const companyNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/company/dashboard' },
  { label: 'Hire Interviewers', icon: Users, href: '/company/hire' },
  { label: 'Interview History', icon: History, href: '/company/history' },
];

const interviewerNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/interviewer/dashboard' },
  { label: 'Profile Settings', icon: UserCog, href: '/interviewer/profile' },
  { label: 'Wallet', icon: Wallet, href: '/interviewer/wallet' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { role } = useAuth();
  const location = useLocation();

  const navItems = role === 'company' ? companyNav : interviewerNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 md:hidden border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-gradient-signature flex items-center justify-center shadow-lg">
                <Sparkles className="size-4 text-white" />
              </div>
              <span className="font-mono font-bold text-sidebar-foreground">Menu</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            <p className="px-3 mb-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Navigation
            </p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-signature text-white shadow-lg shadow-primary/30'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-xl bg-sidebar-accent p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-sidebar-primary" />
                <span className="text-xs font-semibold text-sidebar-foreground">Pro Tip</span>
              </div>
              <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
                {role === 'company'
                  ? 'Find top interviewers and hire them instantly for your interviews.'
                  : 'Complete your profile to increase your visibility and get more requests.'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}