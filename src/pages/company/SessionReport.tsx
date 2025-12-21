import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { History, Calendar, Clock, CheckCircle, XCircle, FileText, Star } from 'lucide-react';

interface InterviewRecord {
  id: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  interviewer: string;
  interviewerAvatar: string;
  date: string;
  time: string;
  duration: string;
  status: 'passed' | 'failed' | 'pending';
  score?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
}

// Mock data
const mockHistory: InterviewRecord[] = [
  {
    id: '1',
    candidateName: 'John Smith',
    candidateEmail: 'john.smith@email.com',
    role: 'Senior React Developer',
    interviewer: 'Sarah Chen',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    date: 'Jan 15, 2024',
    time: '2:00 PM',
    duration: '45 min',
    status: 'passed',
    score: 85,
    summary: 'Strong candidate with excellent React fundamentals and good problem-solving skills. Demonstrated deep understanding of component lifecycle and state management patterns.',
    strengths: ['React Hooks expertise', 'Clean code practices', 'Good communication'],
    improvements: ['System design depth', 'TypeScript advanced patterns'],
  },
  {
    id: '2',
    candidateName: 'Emily Davis',
    candidateEmail: 'emily.davis@email.com',
    role: 'Backend Engineer',
    interviewer: 'Mike Johnson',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    date: 'Jan 14, 2024',
    time: '10:00 AM',
    duration: '60 min',
    status: 'pending',
  },
  {
    id: '3',
    candidateName: 'Alex Turner',
    candidateEmail: 'alex.turner@email.com',
    role: 'System Design',
    interviewer: 'David Lee',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    date: 'Jan 12, 2024',
    time: '3:00 PM',
    duration: '45 min',
    status: 'failed',
    score: 45,
    summary: 'Candidate struggled with scalability concepts and distributed systems fundamentals. Needs more experience with large-scale architecture.',
    strengths: ['Basic understanding of microservices'],
    improvements: ['Database sharding', 'Load balancing strategies', 'Caching mechanisms'],
  },
  {
    id: '4',
    candidateName: 'Rachel Green',
    candidateEmail: 'rachel.green@email.com',
    role: 'Full Stack Developer',
    interviewer: 'Sarah Chen',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    date: 'Jan 10, 2024',
    time: '11:00 AM',
    duration: '50 min',
    status: 'passed',
    score: 92,
    summary: 'Exceptional candidate with strong full-stack capabilities. Great understanding of both frontend and backend technologies.',
    strengths: ['End-to-end development', 'API design', 'Testing practices'],
    improvements: ['DevOps exposure'],
  },
];

export default function SessionReport() {
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          Interview History
        </h1>
        <p className="text-muted-foreground mt-1">
          View past interviews and candidate reports
        </p>
      </div>

      {/* History List */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Interviewer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockHistory.map((interview) => (
                <tr key={interview.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">{interview.candidateName}</p>
                      <p className="text-sm text-muted-foreground">{interview.candidateEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {interview.role}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={interview.interviewerAvatar} />
                        <AvatarFallback>{interview.interviewer[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{interview.interviewer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {interview.date}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        interview.status === 'passed'
                          ? 'success'
                          : interview.status === 'failed'
                          ? 'warning'
                          : 'info'
                      }
                      icon={false}
                    >
                      {interview.status === 'passed' && <CheckCircle className="w-3 h-3" />}
                      {interview.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {interview.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInterview(interview)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      <Dialog open={!!selectedInterview} onOpenChange={(open) => !open && setSelectedInterview(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Report</DialogTitle>
            <DialogDescription>
              {selectedInterview?.candidateName} • {selectedInterview?.role}
            </DialogDescription>
          </DialogHeader>

          {selectedInterview && (
            <div className="space-y-6 py-4">
              {/* Status & Score */}
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      selectedInterview.status === 'passed'
                        ? 'success'
                        : selectedInterview.status === 'failed'
                        ? 'warning'
                        : 'info'
                    }
                    className="text-base px-4 py-1.5"
                  >
                    {selectedInterview.status === 'passed' && <CheckCircle className="w-4 h-4" />}
                    {selectedInterview.status === 'failed' && <XCircle className="w-4 h-4" />}
                    {selectedInterview.status.toUpperCase()}
                  </Badge>
                </div>
                {selectedInterview.score !== undefined && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-foreground">{selectedInterview.score}</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-card border border-border/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                  <p className="font-medium">{selectedInterview.date}</p>
                </div>
                <div className="p-3 bg-card border border-border/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    Duration
                  </div>
                  <p className="font-medium">{selectedInterview.duration}</p>
                </div>
              </div>

              {/* Summary */}
              {selectedInterview.summary && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">AI Summary</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedInterview.summary}
                  </p>
                </div>
              )}

              {/* Strengths */}
              {selectedInterview.strengths && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {selectedInterview.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Improvement */}
              {selectedInterview.improvements && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-warning" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {selectedInterview.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedInterview.status === 'pending' && (
                <div className="p-4 bg-info/10 border border-info/20 rounded-lg text-center">
                  <p className="text-sm text-info">
                    Report is being generated. Check back soon.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
