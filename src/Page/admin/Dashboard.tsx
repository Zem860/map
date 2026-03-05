import StatsCards from '@/components/dashboard/StatsCards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopProducts from '@/components/dashboard/TopProducts';

export default function DashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats overview */}
      <StatsCards />

      {/* Revenue chart - full width */}
      <RevenueChart />

      {/* Bottom row: Recent orders + Top products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}
