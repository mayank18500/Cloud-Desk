import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Building2, User, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/api';

export default function OnboardingPage() {
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setRole(selectedRole);
    setIsLoading(false);
    navigate(selectedRole === 'company' ? '/company/dashboard' : '/interviewer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">II</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome to Intelligent Interviewer
          </h1>
          <p className="text-muted-foreground mt-2">
            Let's get started. How will you be using our platform?
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Company Card */}
          <button
            onClick={() => setSelectedRole('company')}
            className={cn(
              'relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-card-hover',
              selectedRole === 'company'
                ? 'border-company bg-company/5 shadow-card'
                : 'border-border/50 bg-card hover:border-company/50'
            )}
          >
            {selectedRole === 'company' && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="h-6 w-6 text-company" />
              </div>
            )}
            <div className="w-14 h-14 rounded-xl bg-company/10 flex items-center justify-center mb-4">
              <Building2 className="h-7 w-7 text-company" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              I'm hiring
            </h3>
            <p className="text-muted-foreground text-sm">
              Find and hire expert interviewers to evaluate your candidates. Access our marketplace of verified professionals.
            </p>
            <ul className="mt-4 space-y-2">
              {['Browse interviewer marketplace', 'Schedule interviews', 'Get AI-powered reports'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-company" />
                  {item}
                </li>
              ))}
            </ul>
          </button>

          {/* Interviewer Card */}
          <button
            onClick={() => setSelectedRole('interviewer')}
            className={cn(
              'relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-card-hover',
              selectedRole === 'interviewer'
                ? 'border-interviewer bg-interviewer/5 shadow-card'
                : 'border-border/50 bg-card hover:border-interviewer/50'
            )}
          >
            {selectedRole === 'interviewer' && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="h-6 w-6 text-interviewer" />
              </div>
            )}
            <div className="w-14 h-14 rounded-xl bg-interviewer/10 flex items-center justify-center mb-4">
              <User className="h-7 w-7 text-interviewer" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              I'm an interviewer
            </h3>
            <p className="text-muted-foreground text-sm">
              Conduct technical interviews and earn money. Set your own schedule and rates.
            </p>
            <ul className="mt-4 space-y-2">
              {['Set your hourly rate', 'Flexible scheduling', 'Get paid per interview'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-interviewer" />
                  {item}
                </li>
              ))}
            </ul>
          </button>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              'Setting up...'
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
