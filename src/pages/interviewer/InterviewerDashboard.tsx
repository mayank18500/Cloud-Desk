import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RequestRow } from '@/components/dashboard/RequestRow';
import { Badge } from '@/components/shared/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Inbox, Calendar, FileText, DollarSign, Star, Video } from 'lucide-react';

export default function InterviewerDashboard() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Interviews
  const fetchInterviews = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/interviews/user/${user.id}?type=interviewer`);
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      }
    } catch (error) {
      console.error("Failed to load interviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [user]);

  // Derived State
  const requests = interviews.filter(i => i.status === 'pending');
  const upcoming = interviews.filter(i => i.status === 'confirmed');
  const completed = interviews.filter(i => i.status === 'completed');

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/api/interviews/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Interview ${newStatus}`);
      fetchInterviews(); // Refresh data
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your interview schedule</p>
        </div>
      </div>

      {/* Incoming Requests */}
      {requests.length > 0 && (
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <Inbox className="mr-2 h-4 w-4" /> Incoming Requests
          </h2>
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestRow
                key={request._id}
                id={request._id}
                type="incoming"
                companyName={request.companyId?.name || "Unknown Company"}
                companyAvatar={request.companyId?.avatar}
                role={request.role}
                candidateName={request.candidateName}
                date={request.date}
                time={request.time}
                onAccept={() => handleStatusUpdate(request._id, 'confirmed')}
                onDecline={() => handleStatusUpdate(request._id, 'cancelled')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Interviews */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">
          <Video className="mr-2 h-4 w-4" /> Upcoming Interviews
        </h2>
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((interview) => (
              <RequestRow
                key={interview._id}
                id={interview._id}
                type="upcoming"
                companyName={interview.companyId?.name}
                companyAvatar={interview.companyId?.avatar}
                role={interview.role}
                candidateName={interview.candidateName}
                date={interview.date}
                time={interview.time}
                status={interview.status}
                onStart={() => toast.success("Starting video call...")}
              />
            ))}
          </div>
        ) : (
           <p className="text-muted-foreground p-4">No upcoming interviews.</p>
        )}
      </div>
    </div>
  );
}