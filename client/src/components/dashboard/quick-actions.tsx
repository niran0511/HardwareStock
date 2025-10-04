import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDown, ArrowUp, BarChart3, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      title: "Add Product",
      description: "Create new item",
      icon: Plus,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      onClick: () => setLocation("/products"),
    },
    {
      title: "Stock In",
      description: "Receive inventory",
      icon: ArrowDown,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      onClick: () => setLocation("/stock-in"),
    },
    {
      title: "Stock Out",
      description: "Process orders",
      icon: ArrowUp,
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
      onClick: () => setLocation("/stock-out"),
    },
    {
      title: "Generate Report",
      description: "View analytics",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      onClick: () => setLocation("/reports"),
    },
  ];

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 animate-slide-up">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Manage your inventory fast</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                className={`flex flex-col items-center justify-center p-6 h-auto bg-gradient-to-br ${action.bgGradient} hover:scale-105 hover:shadow-lg transition-all duration-300 group relative overflow-hidden border-0 rounded-2xl animate-slide-in-right`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={action.onClick}
                data-testid={`quick-action-${action.title.toLowerCase().replace(' ', '-')}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10`}>
                  <Icon className="text-white w-7 h-7" />
                </div>
                <div className="relative z-10 text-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 block mb-1">{action.title}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{action.description}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
