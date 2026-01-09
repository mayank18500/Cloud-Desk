import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Loader } from '../components/shared/Loader';
import { API_URL } from '../lib/api';

export default function Register() {
  const { register, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'interviewer' | 'company'>('interviewer');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Interviewer fields
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [hiringNeeds, setHiringNeeds] = useState('');

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill all required fields');
      return;
    }

    if (role === 'interviewer' && !cv) {
      toast.error('Please upload your CV');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);

      const profileData = role === 'interviewer'
        ? { skills, experience, portfolio, hourlyRate }
        : { companyName, location, website, hiringNeeds };

      formData.append('profile', JSON.stringify(profileData));

      if (avatar) formData.append('avatar', avatar);
      if (cv) formData.append('cv', cv);

      await register(email, password, formData);

      toast.success('Account created successfully');

      navigate(
        role === 'company'
          ? '/company/dashboard'
          : '/interviewer/dashboard'
      );
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card p-6 rounded-xl border">

        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        {/* Role Switch */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            type="button"
            variant={role === 'interviewer' ? 'default' : 'outline'}
            onClick={() => setRole('interviewer')}
          >
            Interviewer
          </Button>
          <Button
            type="button"
            variant={role === 'company' ? 'default' : 'outline'}
            onClick={() => setRole('company')}
          >
            Company
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <div className="space-y-1.5">
            <Label>Profile Photo (Optional)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
          </div>

          {role === 'interviewer' && (
            <>
              <Input placeholder="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
              <Input placeholder="Experience (years)" value={experience} onChange={(e) => setExperience(e.target.value)} />
              <Input placeholder="Portfolio / LinkedIn" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
              <Input placeholder="Hourly Rate" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
              <div className="space-y-1.5">
                <Label>Upload CV (Required)</Label>
                <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files?.[0] || null)} />
              </div>
            </>
          )}

          {role === 'company' && (
            <>
              <Input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
              <Input placeholder="Hiring Needs" value={hiringNeeds} onChange={(e) => setHiringNeeds(e.target.value)} />
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading || authLoading}>
            {loading ? <Loader size="sm" /> : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
