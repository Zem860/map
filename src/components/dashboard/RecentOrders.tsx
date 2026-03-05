import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled';

interface Order {
  id: string;
  customer: string;
  initials: string;
  status: OrderStatus;
  amount: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    completed: {
      label: 'Completed',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    processing: {
      label: 'Shipping',
      className: 'bg-primary/10 text-primary border-primary/20',
    },
    pending: {
      label: 'Pending',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  };

const recentOrders: Order[] = [
  {
    id: 'ORD-7291',
    customer: 'Zem Zoo',
    initials: 'Z',
    status: 'completed',
    amount: 'NT$ 3,490',
  },
  {
    id: 'ORD-7290',
    customer: 'Gery Lee',
    initials: 'L',
    status: 'processing',
    amount: 'NT$ 12,800',
  },
  {
    id: 'ORD-7289',
    customer: 'Eragon ShadeSlayer',
    initials: 'S',
    status: 'completed',
    amount: 'NT$ 890',
  },
  {
    id: 'ORD-7288',
    customer: 'Wade Watts',
    initials: 'W',
    status: 'pending',
    amount: 'NT$ 5,200',
  },
  {
    id: 'ORD-7287',
    customer: 'John West',
    initials: 'W',
    status: 'cancelled',
    amount: 'NT$ 1,650',
  },
  {
    id: 'ORD-7286',
    customer: 'Ryan Chu',
    initials: 'C',
    status: 'completed',
    amount: 'NT$ 8,750',
  },
];

export default function RecentOrders() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Recent Orders</CardTitle>
        <CardDescription>Latest 6 Order Records</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {/* Desktop table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => {
                const config = statusConfig[order.status];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm font-medium text-foreground">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {order.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">
                          {order.customer}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={config.className}>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium text-foreground">
                      {order.amount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col gap-3 px-6 sm:hidden">
          {recentOrders.map((order) => {
            const config = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      {order.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.customer}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {order.id}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {order.amount}
                  </span>
                  <Badge variant="outline" className={config.className}>
                    {config.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
