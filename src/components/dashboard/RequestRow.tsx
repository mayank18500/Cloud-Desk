import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Check, X, ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestRowProps {
  id: string;
  type: 'incoming' | 'upcoming' | 'pending';
  companyName?: string;
  companyAvatar?: string;
  interviewerName?: string;
  interviewerAvatar?: string;
  candidateName?: string;
  role: string;
  date: string;
  time: string;
  status?: 'pending' | 'confirmed' | 'completed';
  onAccept?: () => void;
  onDecline?: () => void;
  onStart?: () => void;
  onSubmitReport?: () => void;
  className?: string;
}

export function RequestRow({
  type,
  companyName,
  companyAvatar,
  interviewerName,
  interviewerAvatar,
  candidateName,
  role,
  date,
  time,
  status,
  onAccept,
  onDecline,
  onStart,
  onSubmitReport,
  className,
}: RequestRowProps) {
  const name = companyName || interviewerName || 'Unknown';
  const avatar = companyAvatar || interviewerAvatar;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('request-row group', className)}>
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-11 w-11 ring-2 ring-primary/10 transition-all group-hover:ring-primary/30">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-gradient-signature text-white text-sm font-bold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground truncate">{name}</p>
            {status && (
              <Badge
                variant={status === 'confirmed' ? 'success' : status === 'completed' ? 'info' : 'warning'}
                icon={false}
              >
                {status}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="truncate font-medium">{role}</span>
            {candidateName && (
              <>
                <span className="text-base-300">•</span>
                <span className="truncate">Candidate: {candidateName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-base-200 px-2.5 py-1 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-base-200 px-2.5 py-1 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {type === 'incoming' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onDecline}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={onAccept}
                className="btn-gradient rounded-xl gap-1"
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
            </>
          )}
          
          {type === 'upcoming' && (
            <Button 
              size="sm" 
              onClick={onStart}
              className="btn-gradient rounded-xl gap-1.5"
            >
              <ExternalLink className="h-4 w-4" />
              Start Interview
            </Button>
          )}
          
          {type === 'pending' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onSubmitReport}
              className="rounded-xl gap-1.5 border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              Submit Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}