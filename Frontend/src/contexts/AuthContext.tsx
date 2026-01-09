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
  // Flat properties
  title?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  yearsExperience?: number;
  avatar?: string;
  portfolio?: string;
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
    data: FormData | RegisterPayload
  ) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateUser: (userData: Partial<User>) => void; // New function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define API URL
const API_URL = "/api/auth";

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

  /* ---------------- UPDATE USER (NEW) ---------------- */
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('interview_platform_user', JSON.stringify(updatedUser));
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // DEMO BYPASS
    if (password === 'demo') {
      const demoUser: User = {
        id: 'demo-123',
        email,
        name: 'Demo User',
        role: email.includes('company') ? 'company' : 'interviewer',
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
    data: FormData | RegisterPayload
  ) => {
    setIsLoading(true);
    try {
      const isFormData = data instanceof FormData;

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? data : JSON.stringify({
          email,
          password,
          ...data
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
        updateUser,
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