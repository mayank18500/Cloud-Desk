import { Button } from '../../components/ui/button';
import { Badge } from '../../components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Calendar, Clock, Check, X, ExternalLink, FileText, MessageSquare } from 'lucide-react';
import { cn, getMediaUrl } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface RequestRowProps {
  id: string;
  type: 'incoming' | 'upcoming' | 'pending';
  companyId?: string;
  companyName?: string;
  companyWebsite?: string;
  companyAvatar?: string;
  interviewerName?: string;
  interviewerAvatar?: string;
  candidateName?: string;
  role: string;
  date: string;
  time: string;
  cv?: string;
  description?: string;
  status?: 'pending' | 'confirmed' | 'completed';
  onAccept?: () => void;
  onDecline?: () => void;
  onStart?: () => void;
  onSubmitReport?: () => void;
  className?: string;
}

export function RequestRow({
  type,
  companyId,
  companyName,
  companyWebsite,
  companyAvatar,
  interviewerName,
  interviewerAvatar,
  candidateName,
  role,
  date,
  time,
  cv,
  description,
  status,
  onAccept,
  onDecline,
  onStart,
  onSubmitReport,
  className,
}: RequestRowProps) {
  const name = companyName || interviewerName || 'Unknown Company';
  const displayNameForInitials = companyName || interviewerName || 'UC';
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
          <AvatarImage src={getMediaUrl(avatar)} alt={name} />
          <AvatarFallback className="bg-gradient-signature text-white text-sm font-bold">
            {getInitials(displayNameForInitials)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
              Hiring Company
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {companyWebsite ? (
                <a
                  href={companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-foreground hover:underline hover:text-primary transition-all flex items-center gap-1.5"
                >
                  {companyName || "Unknown Company"}
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              ) : (
                <span className="text-lg font-bold text-foreground">
                  {companyName || "Unknown Company"}
                </span>
              )}
              {status && (
                <Badge
                  variant={status === 'confirmed' ? 'success' : status === 'completed' ? 'info' : 'warning'}
                  className="ml-2"
                >
                  {status}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <span className="bg-primary/5 text-primary px-2 py-0.5 rounded text-xs font-semibold border border-primary/10">
              {role}
            </span>
            {candidateName && (
              <>
                <span className="text-base-300">|</span>
                <span className="truncate">Candidate: <span className="font-medium text-foreground/80">{candidateName}</span></span>
              </>
            )}
          </div>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-1 italic border-l-2 border-primary/20 pl-3">
              "{description}"
            </p>
          )}

          {cv && (
            <a
              href={getMediaUrl(cv)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              <FileText className="h-3.5 w-3.5" />
              View CV
            </a>
          )}
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
              {companyId && (
                <Button size="sm" variant="secondary" className="rounded-xl gap-1.5" asChild>
                  <Link to={`/chat?userId=${companyId}`}>
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Link>
                </Button>
              )}
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
            <>
              <Button
                size="sm"
                onClick={onStart}
                className="btn-gradient rounded-xl gap-1.5"
              >
                <ExternalLink className="h-4 w-4" />
                Start Interview
              </Button>
              {companyId && (
                <Button size="sm" variant="secondary" className="rounded-xl gap-1.5" asChild>
                  <Link to={`/chat?userId=${companyId}`}>
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Link>
                </Button>
              )}
            </>
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