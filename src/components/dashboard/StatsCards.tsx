import {
  DollarSign,
  ShoppingBag,
  Users,
  Tag,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, change, icon, description }: StatCardProps) {
  const isPositive = change >= 0;
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="size-3 text-emerald-600" />
          ) : (
            <TrendingDown className="size-3 text-destructive" />
          )}
          <span
            className={`text-xs font-medium ${
              isPositive ? 'text-emerald-600' : 'text-destructive'
            }`}
          >
            {isPositive ? '+' : ''}
            {change}%
          </span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

const statsData: StatCardProps[] = [
  {
    title: 'Revenue',
    value: 'NT$ 1,284,500',
    change: 12.5,
    icon: <DollarSign className="size-4" />,
    description: 'vs Last Month',
  },
  {
    title: 'Monthly Orders',
    value: '2,345',
    change: 8.2,
    icon: <ShoppingBag className="size-4" />,
    description: 'vs Last Month',
  },
  {
    title: 'New Customers',
    value: '573',
    change: -3.1,
    icon: <Users className="size-4" />,
    description: 'vs Last Month',
  },
  {
    title: 'Active Promotions',
    value: '18',
    change: 22.0,
    icon: <Tag className="size-4" />,
    description: 'vs Last Month',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
