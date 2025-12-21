import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'company' | 'interviewer' | null;

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: Record<string, User> = {
  'company@demo.com': {
    id: '1',
    email: 'company@demo.com',
    name: 'Acme Corporation',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=1e40af',
    role: 'company',
  },
  'interviewer@demo.com': {
    id: '2',
    email: 'interviewer@demo.com',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'interviewer',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const stored = localStorage.getItem('interview_platform_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = mockUsers[email.toLowerCase()];
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('interview_platform_user', JSON.stringify(foundUser));
    } else {
      // Create a new user without role for onboarding
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: null,
      };
      setUser(newUser);
      localStorage.setItem('interview_platform_user', JSON.stringify(newUser));
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('interview_platform_user');
  };

  const setRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('interview_platform_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
