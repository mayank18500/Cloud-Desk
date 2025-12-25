import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Save, Plus, X } from 'lucide-react';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
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

  // 1. Fetch Fresh Data from Backend on Mount
  useEffect(() => {
    const fetchProfile = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}`);
            if (response.ok) {
                const userData = await response.json();
                setProfile({
                    name: userData.name || '',
                    title: userData.title || '',
                    bio: userData.bio || '',
                    yearsExperience: userData.yearsExperience || 0,
                    hourlyRate: userData.hourlyRate || 0,
                    skills: userData.skills || [],
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };
    fetchProfile();
  }, [user?.id]); // Only re-run if user ID changes

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
      
      // 2. CRITICAL: Update the AuthContext so the app knows about the changes immediately
      updateUser(updatedUser);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar || ""} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
                id="name" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})} 
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input 
                id="title" 
                placeholder="e.g. Senior React Developer"
                value={profile.title} 
                onChange={(e) => setProfile({...profile, title: e.target.value})} 
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input 
                    id="experience" 
                    type="number" 
                    value={profile.yearsExperience} 
                    onChange={(e) => setProfile({...profile, yearsExperience: parseInt(e.target.value)})} 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="rate">Hourly Rate ($)</Label>
                <Input 
                    id="rate" 
                    type="number" 
                    value={profile.hourlyRate} 
                    onChange={(e) => setProfile({...profile, hourlyRate: parseInt(e.target.value)})} 
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
                id="bio" 
                value={profile.bio} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})} 
                className="min-h-[100px]"
            />
        </div>

        <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
                <Input 
                    value={newSkill} 
                    onChange={(e) => setNewSkill(e.target.value)} 
                    placeholder="Add a skill"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button onClick={handleAddSkill} type="button" size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill) => (
                    <Badge key={skill} className="px-3 py-1">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-destructive">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </div>
    </div>
  );
}