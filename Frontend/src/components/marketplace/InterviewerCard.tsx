import { Badge, SkillTag } from '../../components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Clock, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { cn, getMediaUrl } from '../../lib/utils';

export interface Interviewer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  skills: string[];
  hourlyRate: number;
  isVerified: boolean;
  yearsExperience: number;
  cv?: string;
  portfolio?: string;
}

interface InterviewerCardProps {
  interviewer: Interviewer;
  onHire: (interviewer: Interviewer) => void;
  onViewProfile?: (interviewer: Interviewer) => void;
  onMessage?: (interviewer: Interviewer) => void;
  className?: string;
}

export function InterviewerCard({ interviewer, onHire, onViewProfile, onMessage, className }: InterviewerCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('interviewer-card group', className)}>
      <div className="flex items-start gap-4">
        <Avatar
          className="h-14 w-14 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 cursor-pointer"
          onClick={() => onViewProfile?.(interviewer)}
        >
          <AvatarImage src={getMediaUrl(interviewer.avatar)} alt={interviewer.name} />
          <AvatarFallback className="bg-gradient-signature text-white text-lg font-bold">
            {getInitials(interviewer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="font-bold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
              onClick={() => onViewProfile?.(interviewer)}
            >
              {interviewer.name}
            </h3>
            {interviewer.isVerified && (
              <Badge variant="verified" className="shrink-0">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{interviewer.title}</p>
          <button
            onClick={() => onViewProfile?.(interviewer)}
            className="text-xs text-primary hover:underline mt-1 font-medium"
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{interviewer.yearsExperience} yrs exp</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {interviewer.skills.slice(0, 4).map((skill, index) => (
          <SkillTag
            key={skill}
            skill={skill}
            variant={index === 0 ? 'primary' : index === 1 ? 'accent' : 'default'}
          />
        ))}
        {interviewer.skills.length > 4 && (
          <span className="skill-tag">+{interviewer.skills.length - 4}</span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-base-200">
        <div>
          <span className="text-2xl font-black font-mono text-gradient-primary">₹{interviewer.hourlyRate}</span>
          <span className="text-muted-foreground text-sm">/hr</span>
        </div>
        <div className="flex gap-2">
            <Button
                size="icon"
                variant="outline"
                className="rounded-xl border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => onMessage?.(interviewer)}
            >
                <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
            onClick={() => onHire(interviewer)}
            className="btn-gradient rounded-xl gap-2 group/btn"
            >
            Hire Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
        </div>
      </div>
    </div>
  );
}