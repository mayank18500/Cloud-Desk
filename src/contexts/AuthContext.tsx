import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export type UserRole = 'company' | 'interviewer' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile?: any;
}

interface RegisterPayload {
  name: string;
  role: 'company' | 'interviewer';
  profile: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    data: RegisterPayload
  ) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define API URL
const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('interview_platform_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // DEMO BYPASS: Keep the demo login working for testing if you want
    if (password === 'demo') {
        const demoUser: User = {
            id: 'demo-123',
            email,
            name: 'Demo User',
            role: email.includes('company') ? 'company' : 'interviewer',
            profile: {}
        };
        setUser(demoUser);
        localStorage.setItem('interview_platform_user', JSON.stringify(demoUser));
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      localStorage.setItem('interview_platform_user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */
  const register = async (
    email: string,
    password: string,
    data: RegisterPayload
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: data.name,
          role: data.role,
          profile: data.profile
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Registration failed');
      }

      setUser(resData.user);
      localStorage.setItem('interview_platform_user', JSON.stringify(resData.user));
      localStorage.setItem('token', resData.token);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('interview_platform_user');
    localStorage.removeItem('token');
  };

  /* ---------------- SET ROLE ---------------- */
  const setRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem(
      'interview_platform_user',
      JSON.stringify(updated)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}