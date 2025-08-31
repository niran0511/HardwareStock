import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import LowStockTable from "@/components/dashboard/low-stock-table";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import TopCategories from "@/components/dashboard/top-categories";
import { dashboardApi } from "@/lib/api";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    queryFn: dashboardApi.getMetrics,
  });

  const { data: lowStockProducts, isLoading: lowStockLoading } = useQuery({
    queryKey: ["/api/dashboard/low-stock"],
    queryFn: dashboardApi.getLowStock,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/dashboard/recent-activity"],
    queryFn: () => dashboardApi.getRecentActivity(10),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/dashboard/categories"],
    queryFn: dashboardApi.getCategories,
  });

  return (
    <>
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening in your store." 
      />
      
      <div className="p-6 overflow-y-auto h-screen">
        <MetricsCards metrics={metrics} isLoading={metricsLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LowStockTable products={lowStockProducts} isLoading={lowStockLoading} />
          </div>
          <div>
            <RecentActivity activity={recentActivity} isLoading={activityLoading} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />
          <TopCategories categories={categories} isLoading={categoriesLoading} />
        </div>
      </div>
    </>
  );
}
