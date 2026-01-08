import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader } from '@/components/shared/Loader';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'company' | 'interviewer') => {
    const demoEmail = type === 'company' ? 'company@demo.com' : 'interviewer@demo.com';
    setEmail(demoEmail);
    setPassword('demo');

    setIsLoading(true);
    try {
      await login(demoEmail, 'demo');
      toast.success(`Logged in as demo ${type}!`);
      navigate(type === 'company' ? '/company/dashboard' : '/interviewer/dashboard', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent p-12 flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">II</span>
          </div>
        </div>
        <div>
          <h1 className="text-5xl font-display font-black text-white mb-6">
            Intelligent Interviewer
          </h1>
          <p className="text-white/80 text-xl max-w-lg leading-relaxed">
            The premier platform connecting companies with expert technical interviewers.
            Streamline your hiring process with AI-powered insights.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/70">Expert Interviewers</p>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
              <p className="text-3xl font-bold text-white">10k+</p>
              <p className="text-sm text-white/70">Interviews Conducted</p>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
              <p className="text-3xl font-bold text-white">4.9</p>
              <p className="text-sm text-white/70">Average Rating</p>
            </div>
          </div>
        </div>
        <p className="text-white/50 text-sm">
          © 2026 Intelligent Interviewer. All rights reserved.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-xl">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">II</span>
            </div>
            <h1 className="text-2xl font-display font-bold">Intelligent Interviewer</h1>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-elevated">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Sign in
            </h2>
            <p className="text-muted-foreground mb-6">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 justify-center">
              <button onClick={() => navigate('/register')} className="text-primary underline mt-1 text-center md:col-span-2 md:justify-self-center">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
