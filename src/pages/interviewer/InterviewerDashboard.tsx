import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RequestRow } from '@/components/dashboard/RequestRow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Inbox,
  Calendar,
  FileText,
  DollarSign,
  Star,
  Video,
  Sparkles,
} from 'lucide-react';

// Mock data
const mockIncomingRequests = [
  {
    id: '1',
    companyName: 'Acme Corporation',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=4361ee',
    role: 'Senior React Developer',
    candidateName: 'John Smith',
    date: 'Jan 20, 2024',
    time: '2:00 PM',
  },
  {
    id: '2',
    companyName: 'TechStart Inc',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TS&backgroundColor=00b4d8',
    role: 'Backend Engineer',
    candidateName: 'Emily Davis',
    date: 'Jan 21, 2024',
    time: '10:00 AM',
  },
];

const mockUpcomingInterviews = [
  {
    id: '3',
    companyName: 'GlobalTech',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GT&backgroundColor=7c3aed',
    role: 'System Design',
    candidateName: 'Alex Turner',
    date: 'Jan 18, 2024',
    time: '3:00 PM',
    status: 'confirmed' as const,
  },
  {
    id: '4',
    companyName: 'Innovate Labs',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=IL&backgroundColor=10b981',
    role: 'Full Stack Developer',
    candidateName: 'Rachel Green',
    date: 'Jan 19, 2024',
    time: '11:00 AM',
    status: 'confirmed' as const,
  },
];

const mockPendingReports = [
  {
    id: '5',
    companyName: 'DataDriven Co',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DD&backgroundColor=ef4444',
    role: 'ML Engineer',
    candidateName: 'Ross Geller',
    date: 'Jan 15, 2024',
    time: '2:00 PM',
    status: 'completed' as const,
  },
];

export default function InterviewerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockIncomingRequests);
  const [upcoming, setUpcoming] = useState(mockUpcomingInterviews);
  const [pending, setPending] = useState(mockPendingReports);

  const handleAccept = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setRequests(requests.filter(r => r.id !== id));
      setUpcoming([...upcoming, { ...request, status: 'confirmed' as const }]);
      toast.success('Interview accepted!');
    }
  };

  const handleDecline = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    toast.info('Interview declined');
  };

  const handleStart = (id: string) => {
    toast.success('Launching interview room...', {
      description: 'Opening Site B in a new tab',
    });
  };

  const handleSubmitReport = (id: string) => {
    setPending(pending.filter(p => p.id !== id));
    toast.success('Report submitted successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your interview schedule and earnings
          </p>
        </div>
        <Badge variant="interviewer" className="w-fit shadow-lg">
          <Star className="w-3.5 h-3.5" />
          4.9 Rating • 48 Reviews
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Incoming Requests"
          value={requests.length}
          subtitle="Awaiting response"
          icon={Inbox}
          variant="primary"
          className="animate-fade-in stagger-1"
        />
        <StatCard
          title="Upcoming Interviews"
          value={upcoming.length}
          subtitle="This week"
          icon={Calendar}
          variant="accent"
          className="animate-fade-in stagger-2"
        />
        <StatCard
          title="This Month's Earnings"
          value="$2,450"
          subtitle="12 interviews"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          variant="success"
          className="animate-fade-in stagger-3"
        />
        <StatCard
          title="Pending Reports"
          value={pending.length}
          subtitle="Need submission"
          icon={FileText}
          variant="warning"
          className="animate-fade-in stagger-4"
        />
      </div>

      {/* Incoming Requests */}
      {requests.length > 0 && (
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <div className="size-8 rounded-lg bg-gradient-signature flex items-center justify-center">
              <Inbox className="h-4 w-4 text-white" />
            </div>
            Incoming Requests
            <Badge variant="warning" className="ml-2">
              {requests.length} new
            </Badge>
          </h2>
          
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestRow
                key={request.id}
                id={request.id}
                type="incoming"
                companyName={request.companyName}
                companyAvatar={request.companyAvatar}
                role={request.role}
                candidateName={request.candidateName}
                date={request.date}
                time={request.time}
                onAccept={() => handleAccept(request.id)}
                onDecline={() => handleDecline(request.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Interviews */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">
          <div className="size-8 rounded-lg stat-icon-accent flex items-center justify-center">
            <Video className="h-4 w-4 text-white" />
          </div>
          Upcoming Interviews
        </h2>
        
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((interview) => (
              <RequestRow
                key={interview.id}
                id={interview.id}
                type="upcoming"
                companyName={interview.companyName}
                companyAvatar={interview.companyAvatar}
                role={interview.role}
                candidateName={interview.candidateName}
                date={interview.date}
                time={interview.time}
                status={interview.status}
                onStart={() => handleStart(interview.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center glass-card">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No upcoming interviews</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Accept requests to get started</p>
          </div>
        )}
      </div>

      {/* Pending Reports */}
      {pending.length > 0 && (
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <div className="size-8 rounded-lg stat-icon-warning flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            Pending Reports
          </h2>
          
          <div className="space-y-3">
            {pending.map((report) => (
              <RequestRow
                key={report.id}
                id={report.id}
                type="pending"
                companyName={report.companyName}
                companyAvatar={report.companyAvatar}
                role={report.role}
                candidateName={report.candidateName}
                date={report.date}
                time={report.time}
                status={report.status}
                onSubmitReport={() => handleSubmitReport(report.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}