import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, Sparkles } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
}

export default function Header({ title, subtitle, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="glassmorphism sticky top-0 z-10 px-6 py-5 mb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {onSearch && (
            <form onSubmit={handleSearch} className="relative group">
              <Input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-11 pr-4 h-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                data-testid="search-input"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 w-5 h-5 transition-colors duration-300" />
            </form>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl h-11 w-11 transition-all duration-300 hover:scale-105" 
            data-testid="notifications-button"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
              3
            </span>
          </Button>
          <div className="flex items-center space-x-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-purple-100 dark:ring-purple-900/50 transition-transform duration-300 hover:scale-110 cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100 block">John Smith</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
