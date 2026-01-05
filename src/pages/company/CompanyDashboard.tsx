import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Video, IndianRupee, TrendingUp, Plus, ArrowRight, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { getMediaUrl } from '@/lib/utils';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Data
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user?.id) return;
      try {
        // Fetch interviews where the companyId matches the logged-in user
        const response = await fetch(`http://localhost:5000/api/interviews/user/${user.id}?type=company`);
        if (response.ok) {
          const data = await response.json();
          setInterviews(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [user]);

  // 2. Calculate Real Stats
  const upcoming = interviews.filter(i => i.status === 'confirmed' || i.status === 'scheduled');
  const completed = interviews.filter(i => i.status === 'completed');
  const totalHires = interviews.filter(i => i.result === 'passed').length;

  // Calculate total spent (assuming a fixed rate or fetching from interview data)
  const totalSpent = completed.length * 50; // Example: $50 per interview

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your hiring pipeline
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/company/history">View History <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild>
            <Link to="/company/hire"><Plus className="mr-2 h-4 w-4" /> Hire Interviewer</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Hires"
          value={totalHires.toString()}
          subtitle="Candidates passed"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Active Interviews"
          value={upcoming.length.toString()}
          subtitle="Scheduled / Confirmed"
          icon={Video}
          variant="accent"
        />
        <StatCard
          title="Total Spent"
          value={`₹${totalSpent}`}
          subtitle="Estimated cost"
          icon={IndianRupee}
          variant="success"
        />
        <StatCard
          title="Total Interviews"
          value={interviews.length.toString()}
          subtitle="All time"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Interviews List */}
        <div className="lg:col-span-2 dashboard-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="dashboard-section-title"><Video className="h-5 w-5 text-primary" /> Recent Activity</h2>
          </div>
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="divide-y divide-border/50">
              {interviews.slice(0, 5).map((interview) => (
                <div key={interview._id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getMediaUrl(interview.interviewerId?.avatar)} />
                    <AvatarFallback>{interview.interviewerId?.name?.[0] || 'I'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{interview.candidateName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {interview.role} • with {interview.interviewerId?.name || 'Interviewer'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                      <Link to={`/chat?userId=${interview.interviewerId?._id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Badge variant={interview.status === 'completed' ? 'success' : 'info'} icon={false}>
                      {interview.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {interviews.length === 0 && <div className="p-4 text-center text-muted-foreground">No interviews found.</div>}
            </div>
          </div>
        </div>

        {/* Upcoming List */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title"><Calendar className="h-5 w-5 text-accent" /> Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((interview) => (
              <div key={interview._id} className="p-4 bg-card rounded-lg border border-border/50 relative group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-8 w-8" asChild>
                    <Link to={`/chat?userId=${interview.interviewerId?._id}`}>
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-start justify-between pr-10">
                  <div>
                    <p className="font-medium text-foreground">{interview.candidateName}</p>
                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {interview.date}</div>
                  <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {interview.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}