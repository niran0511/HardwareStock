import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { StockTransactionWithDetails } from "@shared/schema";

interface StockTransactionsTableProps {
  transactions?: StockTransactionWithDetails[];
  isLoading: boolean;
}

export default function StockTransactionsTable({ transactions, isLoading }: StockTransactionsTableProps) {
  const formatTimestamp = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      purchase: 'Purchase',
      sale: 'Sale',
      return: 'Return',
      wastage: 'Wastage',
      adjustment: 'Adjustment',
    };
    return labels[reason] || reason;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Product
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Type
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Quantity
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Value
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions?.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions?.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-muted/30" data-testid={`transaction-row-${transaction.id}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground" data-testid={`transaction-product-${transaction.id}`}>
                      {transaction.productName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.productSku}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 ${transaction.type === 'in' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                      {transaction.type === 'in' ? (
                        <ArrowDown className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowUp className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <span className="text-sm text-foreground" data-testid={`transaction-reason-${transaction.id}`}>
                      {getReasonLabel(transaction.reason)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" data-testid={`transaction-quantity-${transaction.id}`}>
                  {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" data-testid={`transaction-value-${transaction.id}`}>
                  ${parseFloat(transaction.totalValue || '0').toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground" data-testid={`transaction-date-${transaction.id}`}>
                  {formatTimestamp(transaction.timestamp)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
