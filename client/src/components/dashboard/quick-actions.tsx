import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDown, ArrowUp, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      title: "Add Product",
      icon: Plus,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      hoverBg: "group-hover:bg-blue-200",
      onClick: () => setLocation("/products"),
    },
    {
      title: "Stock In",
      icon: ArrowDown,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      hoverBg: "group-hover:bg-green-200",
      onClick: () => setLocation("/stock-in"),
    },
    {
      title: "Stock Out",
      icon: ArrowUp,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      hoverBg: "group-hover:bg-red-200",
      onClick: () => setLocation("/stock-out"),
    },
    {
      title: "Generate Report",
      icon: BarChart3,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      hoverBg: "group-hover:bg-purple-200",
      onClick: () => setLocation("/reports"),
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="flex flex-col items-center justify-center p-4 h-auto border border-border hover:bg-muted/30 transition-colors group"
                onClick={action.onClick}
                data-testid={`quick-action-${action.title.toLowerCase().replace(' ', '-')}`}
              >
                <div className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center mb-3 transition-colors ${action.hoverBg}`}>
                  <Icon className={`${action.iconColor} w-6 h-6`} />
                </div>
                <span className="text-sm font-medium text-foreground">{action.title}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
