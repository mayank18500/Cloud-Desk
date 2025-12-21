import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  Video,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data
const recentInterviews = [
  {
    id: '1',
    candidateName: 'John Smith',
    role: 'Senior React Developer',
    interviewer: 'Sarah Chen',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    date: '2024-01-15',
    status: 'completed',
    result: 'passed',
  },
  {
    id: '2',
    candidateName: 'Emily Davis',
    role: 'Backend Engineer',
    interviewer: 'Mike Johnson',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    date: '2024-01-14',
    status: 'completed',
    result: 'pending',
  },
  {
    id: '3',
    candidateName: 'Alex Turner',
    role: 'System Design',
    interviewer: 'David Lee',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    date: '2024-01-18',
    status: 'scheduled',
    result: null,
  },
];

const upcomingInterviews = [
  {
    id: '4',
    candidateName: 'Rachel Green',
    role: 'Full Stack Developer',
    interviewer: 'Sarah Chen',
    date: 'Jan 20, 2024',
    time: '2:00 PM',
  },
  {
    id: '5',
    candidateName: 'Ross Geller',
    role: 'DevOps Engineer',
    interviewer: 'Mike Johnson',
    date: 'Jan 21, 2024',
    time: '10:00 AM',
  },
];

export default function CompanyDashboard() {
  const { user } = useAuth();

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
            <Link to="/company/history">
              View History
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link to="/company/hire">
              <Plus className="mr-2 h-4 w-4" />
              Hire Interviewer
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Hires"
          value="24"
          subtitle="Candidates hired"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
          className="animate-fade-in stagger-1"
        />
        <StatCard
          title="Active Interviews"
          value="8"
          subtitle="In progress"
          icon={Video}
          variant="accent"
          className="animate-fade-in stagger-2"
        />
        <StatCard
          title="Total Spent"
          value="$12,450"
          subtitle="This month"
          icon={DollarSign}
          trend={{ value: 8, isPositive: false }}
          variant="success"
          className="animate-fade-in stagger-3"
        />
        <StatCard
          title="Success Rate"
          value="87%"
          subtitle="Pass rate"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          variant="default"
          className="animate-fade-in stagger-4"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Interviews */}
        <div className="lg:col-span-2 dashboard-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="dashboard-section-title">
              <Video className="h-5 w-5 text-primary" />
              Recent Interviews
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/company/history">View all</Link>
            </Button>
          </div>
          
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="divide-y divide-border/50">
              {recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={interview.interviewerAvatar} alt={interview.interviewer} />
                    <AvatarFallback>{interview.interviewer[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {interview.candidateName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {interview.role} • by {interview.interviewer}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        interview.result === 'passed'
                          ? 'success'
                          : interview.status === 'scheduled'
                          ? 'info'
                          : 'warning'
                      }
                      icon={false}
                    >
                      {interview.result || interview.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <Calendar className="h-5 w-5 text-accent" />
            Upcoming
          </h2>
          
          <div className="space-y-3">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="p-4 bg-card rounded-lg border border-border/50 hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{interview.candidateName}</p>
                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                  </div>
                  <Badge variant="info" icon={false}>
                    Scheduled
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {interview.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {interview.time}
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full" asChild>
              <Link to="/company/hire">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Interview
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
