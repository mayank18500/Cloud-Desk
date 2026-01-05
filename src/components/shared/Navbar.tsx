import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/Badge';
import {
  Menu,
  LogOut,
  Settings,
  Bell,
  Building2,
  User,
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMediaUrl } from '@/lib/utils';
import { DeleteAccountModal } from './DeleteAccountModal';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout, role } = useAuth();
  const location = useLocation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="glass-navbar">
      <div className="max-w-full mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* Left Side - Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-3 hover-scale">
            {/* Gradient Logo */}
            <div className="size-10 rounded-xl bg-gradient-signature flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Zap className="size-5" />
            </div>
            <span className="font-mono font-black text-xl text-gradient hidden sm:block">
              CloudDesk
            </span>
          </Link>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {role && (
            <Badge variant={role} className="hidden sm:flex">
              {role === 'company' ? (
                <>
                  <Building2 className="w-3 h-3" />
                  Company
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  Interviewer
                </>
              )}
            </Badge>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-primary/10 rounded-xl"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-signature rounded-full ring-2 ring-card" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 hover:bg-primary/10">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={getMediaUrl(user?.avatar)} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-signature text-white font-bold">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {role === 'interviewer' && (
                <DropdownMenuItem asChild>
                  <Link to="/interviewer/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-destructive focus:text-destructive cursor-pointer font-medium"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </nav>
  );
}