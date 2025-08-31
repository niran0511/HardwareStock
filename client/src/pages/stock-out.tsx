import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import StockTransactionForm from "@/components/forms/stock-transaction-form";
import StockTransactionsTable from "@/components/tables/stock-transactions-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stockTransactionsApi } from "@/lib/api";

export default function StockOut() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/stock-transactions", refreshKey],
    queryFn: stockTransactionsApi.getAll,
  });

  const stockOutTransactions = transactions?.filter(t => t.type === 'out') || [];

  const handleTransactionSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Header 
        title="Stock Out" 
        subtitle="Record outgoing stock from sales, wastage, and adjustments"
      />
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Add Stock Out Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <StockTransactionForm 
                type="out" 
                onSuccess={handleTransactionSuccess}
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Recent Stock Out Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <StockTransactionsTable 
                  transactions={stockOutTransactions} 
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
