import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/ui/button';
import {
  Wallet as WalletIcon,
  DollarSign,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Building2,
  CreditCard,
} from 'lucide-react';

// Mock data
const mockPayouts = [
  {
    id: '1',
    amount: 240,
    company: 'Acme Corporation',
    date: 'Jan 15, 2024',
    status: 'completed',
    interviews: 2,
  },
  {
    id: '2',
    amount: 180,
    company: 'TechStart Inc',
    date: 'Jan 12, 2024',
    status: 'completed',
    interviews: 1,
  },
  {
    id: '3',
    amount: 360,
    company: 'GlobalTech',
    date: 'Jan 10, 2024',
    status: 'completed',
    interviews: 3,
  },
  {
    id: '4',
    amount: 120,
    company: 'Innovate Labs',
    date: 'Jan 8, 2024',
    status: 'completed',
    interviews: 1,
  },
  {
    id: '5',
    amount: 480,
    company: 'DataDriven Co',
    date: 'Jan 5, 2024',
    status: 'completed',
    interviews: 4,
  },
];

const pendingPayouts = [
  {
    id: 'p1',
    amount: 360,
    company: 'StartupXYZ',
    expectedDate: 'Jan 22, 2024',
    interviews: 3,
  },
];

export default function Wallet() {
  const totalBalance = 2450;
  const pendingAmount = 360;
  const totalEarned = 15680;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <WalletIcon className="h-8 w-8 text-primary" />
            Wallet
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your earnings and payouts
          </p>
        </div>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Withdraw Funds
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="stat-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className="text-4xl font-bold font-display text-foreground mt-2">
                ${totalBalance.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Available to withdraw</p>
            </div>
            <div className="stat-card-icon bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <StatCard
          title="Pending Payouts"
          value={`$${pendingAmount}`}
          subtitle="Processing"
          icon={TrendingUp}
          variant="accent"
        />

        <StatCard
          title="Total Earned"
          value={`$${totalEarned.toLocaleString()}`}
          subtitle="All time"
          icon={ArrowUpRight}
          variant="success"
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Pending Payouts */}
      {pendingPayouts.length > 0 && (
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <TrendingUp className="h-5 w-5 text-accent" />
            Pending Payouts
          </h2>
          
          <div className="bg-card rounded-xl border border-accent/20 overflow-hidden">
            {pendingPayouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 bg-accent/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{payout.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {payout.interviews} interview{payout.interviews > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-accent">${payout.amount}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Est. {payout.expectedDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Payouts */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">
          <ArrowDownRight className="h-5 w-5 text-success" />
          Recent Payouts
        </h2>
        
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="divide-y divide-border/50">
            {mockPayouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <ArrowDownRight className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{payout.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {payout.interviews} interview{payout.interviews > 1 ? 's' : ''} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success">+${payout.amount}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {payout.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <Button variant="outline">View All Transactions</Button>
        </div>
      </div>
    </div>
  );
}
