import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, AlertTriangle, DollarSign, Truck, TrendingUp, TrendingDown } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

interface MetricsCardsProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
}

export default function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const cards = [
    {
      title: "Total Products",
      value: metrics.totalProducts.toLocaleString(),
      icon: Package,
      gradient: "from-blue-500 to-cyan-400",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
      change: "+12%",
      trending: "up",
      changeLabel: "from last month",
    },
    {
      title: "Low Stock Alerts",
      value: metrics.lowStockCount.toString(),
      icon: AlertTriangle,
      gradient: "from-amber-500 to-orange-400",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-400",
      change: "+3",
      trending: "down",
      changeLabel: "needs attention",
    },
    {
      title: "Total Stock Value",
      value: `₹${metrics.totalStockValue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-400",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-400",
      change: "+8.2%",
      trending: "up",
      changeLabel: "from last month",
    },
    {
      title: "Active Suppliers",
      value: metrics.activeSuppliers.toString(),
      icon: Truck,
      gradient: "from-purple-500 to-pink-400",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-400",
      change: "+2",
      trending: "up",
      changeLabel: "new this month",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trending === 'up' ? TrendingUp : TrendingDown;
        return (
          <Card 
            key={index} 
            className={`metric-card shadow-lg border-0 bg-gradient-to-br ${card.bgGradient} animate-slide-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2" data-testid={`metric-${card.title.toLowerCase().replace(/\s+/g, '-')}-label`}>
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent" data-testid={`metric-${card.title.toLowerCase().replace(/\s+/g, '-')}-value`}>
                    {card.value}
                  </p>
                </div>
                <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white w-7 h-7" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-1">
                  <TrendIcon className={`w-4 h-4 ${card.trending === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                  <span className={`text-sm font-bold ${card.trending === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {card.change}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {card.changeLabel}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
