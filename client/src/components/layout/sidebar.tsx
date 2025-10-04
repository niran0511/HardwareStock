import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  Package, 
  ArrowDown, 
  ArrowUp, 
  Truck, 
  Users, 
  BarChart3, 
  Settings,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine },
  { name: "Products", href: "/products", icon: Package },
  { name: "Stock In", href: "/stock-in", icon: ArrowDown },
  { name: "Stock Out", href: "/stock-out", icon: ArrowUp },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">StockPro</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Inventory Manager</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-1.5">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name} className="animate-slide-in-right" style={{ animationDelay: `${index * 50}ms` }}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50 hover:text-purple-700 dark:hover:text-purple-300 hover:scale-105"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                  )}
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <Sparkles className="w-3 h-3 ml-auto text-white/80 animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-purple-900 dark:text-purple-100">Need Help?</h3>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
            Check our documentation for guides and tips
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
            View Docs
          </button>
        </div>
      </div>
    </aside>
  );
}
