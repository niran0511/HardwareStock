import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, Plus, Activity, Clock } from "lucide-react";
import type { StockTransactionWithDetails } from "@shared/schema";

interface RecentActivityProps {
  activity?: StockTransactionWithDetails[];
  isLoading: boolean;
}

export default function RecentActivity({ activity, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string, reason: string) => {
    if (type === 'in') {
      return <ArrowDown className="w-4 h-4" />;
    } else if (type === 'out') {
      return <ArrowUp className="w-4 h-4" />;
    }
    return <Plus className="w-4 h-4" />;
  };

  const getActivityGradient = (type: string) => {
    if (type === 'in') return 'from-emerald-500 to-teal-500';
    if (type === 'out') return 'from-rose-500 to-pink-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getActivityBgGradient = (type: string) => {
    if (type === 'in') return 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20';
    if (type === 'out') return 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20';
    return 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20';
  };

  const getActivityDescription = (transaction: StockTransactionWithDetails) => {
    if (transaction.type === 'in') {
      return `Stock In: ${transaction.productName}`;
    } else if (transaction.type === 'out') {
      return `Stock Out: ${transaction.productName}`;
    }
    return `Transaction: ${transaction.productName}`;
  };

  const getActivityDetails = (transaction: StockTransactionWithDetails) => {
    const sign = transaction.type === 'in' ? '+' : '-';
    const reason = transaction.reason === 'purchase' ? 'from supplier' :
                  transaction.reason === 'sale' ? 'sold to customer' :
                  transaction.reason;
    
    return `${sign}${transaction.quantity} units ${reason}`;
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 animate-slide-up">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Activity</CardTitle>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Latest inventory transactions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {activity?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No recent activity</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Transactions will appear here</p>
            </div>
          ) : (
            activity?.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className={`flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br ${getActivityBgGradient(transaction.type)} hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 animate-slide-in-right`}
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`activity-${transaction.id}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${getActivityGradient(transaction.type)} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-white">
                    {getActivityIcon(transaction.type, transaction.reason)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1" data-testid={`activity-description-${transaction.id}`}>
                    {getActivityDescription(transaction)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2" data-testid={`activity-details-${transaction.id}`}>
                    {getActivityDetails(transaction)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-500 dark:text-gray-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-medium" data-testid={`activity-timestamp-${transaction.id}`}>
                      {formatTimestamp(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50 text-purple-700 dark:text-purple-300 font-semibold rounded-xl border-0 h-12" 
          data-testid="view-all-activity"
        >
          View All Activity →
        </Button>
      </CardContent>
    </Card>
  );
}
