import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import type { StockTransactionWithDetails } from "@shared/schema";

interface RecentActivityProps {
  activity?: StockTransactionWithDetails[];
  isLoading: boolean;
}

export default function RecentActivity({ activity, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="border-b border-border">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string, reason: string) => {
    if (type === 'in') {
      return <ArrowDown className="w-3 h-3" />;
    } else if (type === 'out') {
      return <ArrowUp className="w-3 h-3" />;
    }
    return <Plus className="w-3 h-3" />;
  };

  const getActivityBg = (type: string) => {
    if (type === 'in') return 'bg-green-100';
    if (type === 'out') return 'bg-red-100';
    return 'bg-blue-100';
  };

  const getActivityIconColor = (type: string) => {
    if (type === 'in') return 'text-green-600';
    if (type === 'out') return 'text-red-600';
    return 'text-blue-600';
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
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activity?.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div>
          ) : (
            activity?.map((transaction) => (
              <div key={transaction.id} className="flex items-start space-x-3" data-testid={`activity-${transaction.id}`}>
                <div className={`w-8 h-8 ${getActivityBg(transaction.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className={getActivityIconColor(transaction.type)}>
                    {getActivityIcon(transaction.type, transaction.reason)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground" data-testid={`activity-description-${transaction.id}`}>
                    {getActivityDescription(transaction)}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`activity-details-${transaction.id}`}>
                    {getActivityDetails(transaction)}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`activity-timestamp-${transaction.id}`}>
                    {formatTimestamp(transaction.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          data-testid="view-all-activity"
        >
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
