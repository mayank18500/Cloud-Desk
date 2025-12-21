import { useState } from 'react';
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
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    title: 'Senior Software Engineer',
    bio: 'Passionate about helping candidates succeed in technical interviews. 8+ years of experience at top tech companies including Google and Amazon.',
    yearsExperience: 8,
    hourlyRate: 120,
    skills: ['React', 'System Design', 'JavaScript', 'TypeScript', 'Node.js'],
  });

  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <UserCog className="h-8 w-8 text-primary" />
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your interviewer profile
          </p>
        </div>
        <Badge variant="verified">
          <CheckCircle className="w-3 h-3" />
          Verified
        </Badge>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-xl border border-border/50 p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-border">
              <AvatarImage src={user?.avatar} alt={profile.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.title}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium">4.9</span>
                <span className="text-muted-foreground">(48 reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g., Senior Engineer at Google"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell companies about your experience and expertise..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Years of Experience
              </Label>
              <Input
                id="experience"
                type="number"
                value={profile.yearsExperience}
                onChange={(e) => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 0 })}
                min="0"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Hourly Rate (USD)
              </Label>
              <Input
                id="rate"
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills & Expertise</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                    index === 0
                      ? 'bg-primary/10 text-primary'
                      : index === 1
                      ? 'bg-accent/10 text-accent'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
