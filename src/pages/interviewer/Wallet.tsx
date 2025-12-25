import { useState, useEffect } from 'react';
import {Badge} from '@/components/shared/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, DollarSign, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Wallet() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/interviews/user/${user.id}?type=interviewer`);
        if (response.ok) {
          const data = await response.json();
          setInterviews(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Calculate Earnings
  const hourlyRate = user?.hourlyRate || (user as any)?.profile?.hourlyRate || 0;
  
  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const pendingInterviews = interviews.filter(i => i.status === 'confirmed'); // Confirmed but not done
  
  // Simple calculation: Each completed interview earns the hourly rate
  const totalEarned = completedInterviews.length * hourlyRate;
  const pendingAmount = pendingInterviews.length * hourlyRate;
  const currentBalance = totalEarned; // Assuming no withdrawals yet

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <WalletIcon className="h-8 w-8 text-primary" /> Wallet
          </h1>
          <p className="text-muted-foreground mt-1">Track your earnings</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="stat-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className="text-4xl font-bold font-display text-foreground mt-2">
                ${currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="stat-card-icon bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <StatCard
          title="Pending"
          value={`$${pendingAmount}`}
          subtitle="Upcoming Interviews"
          icon={TrendingUp}
          variant="accent"
        />

        <StatCard
          title="Total Earned"
          value={`$${totalEarned.toLocaleString()}`}
          subtitle="All time"
          icon={ArrowUpRight}
          variant="success"
        />
      </div>

      {/* Recent Transactions List */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Recent Payouts (Completed Interviews)</h2>
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="divide-y divide-border/50">
            {completedInterviews.length === 0 ? (
               <p className="p-4 text-muted-foreground">No completed interviews yet.</p>
            ) : (
                completedInterviews.map((interview) => (
                <div key={interview._id} className="flex items-center justify-between p-4">
                    <div>
                    <p className="font-medium text-foreground">{interview.companyId?.name || "Company"}</p>
                    <p className="text-sm text-muted-foreground">{interview.role} • {interview.date}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-lg font-bold text-success">+${hourlyRate}</p>
                    <Badge variant="success" icon={false}>Paid</Badge>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}