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
  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const stored = localStorage.getItem('interview_platform_user');
    if (!stored) {
      setIsLoading(false);
      throw new Error('User not found');
    }

    const parsed = JSON.parse(stored);
    if (parsed.email !== email) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }

    setUser(parsed);
    setIsLoading(false);
  };

  /* ---------------- REGISTER ---------------- */
  const register = async (
    email: string,
    _password: string,
    data: RegisterPayload
  ) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: data.name,
      role: data.role,
      profile: data.profile,
    };

    setUser(newUser);
    localStorage.setItem(
      'interview_platform_user',
      JSON.stringify(newUser)
    );

    setIsLoading(false);
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('interview_platform_user');
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
