import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, AlertTriangle, DollarSign, Truck } from "lucide-react";
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
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
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
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+12%",
      changeColor: "text-green-600",
      changeLabel: "from last month",
    },
    {
      title: "Low Stock Alerts",
      value: metrics.lowStockCount.toString(),
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      change: "+3",
      changeColor: "text-red-600",
      changeLabel: "since yesterday",
    },
    {
      title: "Total Stock Value",
      value: `₹${metrics.totalStockValue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+8.2%",
      changeColor: "text-green-600",
      changeLabel: "from last month",
    },
    {
      title: "Active Suppliers",
      value: metrics.activeSuppliers.toString(),
      icon: Truck,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "+2",
      changeColor: "text-green-600",
      changeLabel: "new this month",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground" data-testid={`metric-${card.title.toLowerCase().replace(/\s+/g, '-')}-label`}>
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid={`metric-${card.title.toLowerCase().replace(/\s+/g, '-')}-value`}>
                    {card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${card.iconColor} w-6 h-6`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm ${card.changeColor} font-medium`}>
                  {card.change}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
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
