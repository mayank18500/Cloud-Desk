import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  UserCog,
  Save,
  Plus,
  X,
  CheckCircle,
  Camera,
  Star,
  DollarSign,
  Briefcase,
} from 'lucide-react';

export default function EditProfile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    yearsExperience: 0,
    hourlyRate: 0,
    skills: [] as string[],
  });

  // Load data on mount
  useEffect(() => {
    if (user?.id) {
        // In a real app, you might fetch fresh data here:
        // fetch(`http://localhost:5000/api/users/${user.id}`)...
        // For now, we sync with the User Context or init defaults
        setProfile({
            name: user.name || '',
            title: user.profile?.title || 'Interviewer',
            bio: user.profile?.bio || '',
            yearsExperience: user.profile?.yearsExperience || 0,
            hourlyRate: user.profile?.hourlyRate || 0,
            skills: user.profile?.skills || [],
        });
    }
  }, [user]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            skills: profile.skills,
            hourlyRate: profile.hourlyRate,
            yearsExperience: profile.yearsExperience
        }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      const updatedUser = await response.json();
      // Optionally update AuthContext user here if you exposed a setUser method
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  // ... The return (JSX) remains exactly the same as your provided file
  // ... just ensure the input values point to the `profile` state variables
  
  return (
    <div className="space-y-6 max-w-2xl">
      {/* ... Header and Avatar Code ... */}
      
      {/* Example of updated input binding */}
       <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="min-h-[120px]"
            />
       </div>

       {/* ... Rest of the JSX ... */}
        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
          </Button>
        </div>
    </div>
  );
}