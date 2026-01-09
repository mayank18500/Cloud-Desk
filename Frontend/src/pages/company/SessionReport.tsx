import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/shared/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { History, Calendar, Clock, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../../lib/api';

export default function SessionReport() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`${API_URL}/api/interviews/user/${user.id}?type=company`);
        if (response.ok) {
          const data = await response.json();
          // Sort by date (newest first)
          setInterviews(data.reverse());
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

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
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Candidate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Interviewer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {interviews.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No interviews found.</td></tr>
              ) : (
                interviews.map((interview) => (
                  <tr key={interview._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">{interview.candidateName}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">{interview.role}</td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>{interview.interviewerId?.name?.[0] || 'I'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{interview.interviewerId?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                      {interview.date} {interview.time}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={interview.status === 'completed' ? 'success' : 'info'}
                        icon={false}
                      >
                        {interview.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedInterview(interview)}>
                        <FileText className="h-4 w-4 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      <Dialog open={!!selectedInterview} onOpenChange={(open) => !open && setSelectedInterview(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>
              {selectedInterview?.candidateName} • {selectedInterview?.role}
            </DialogDescription>
          </DialogHeader>

          {selectedInterview && (
            <div className="space-y-6 py-4">
              {/* Notes Section (Since we don't have AI summary yet) */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Interviewer Notes</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedInterview.notes || "No notes provided for this session."}
                </p>
              </div>

              <div className="p-3 bg-card border border-border/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" /> Date & Time
                </div>
                <p className="font-medium">{selectedInterview.date} at {selectedInterview.time}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}