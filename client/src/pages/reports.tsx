import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Package2, Wrench, Layers } from "lucide-react";
import { reportsApi, stockTransactionsApi } from "@/lib/api";
import type { ProductWithStock, StockTransactionWithDetails } from "@shared/schema";

const categoryIcons = {
  "Handles": Package2,
  "Hardware": Wrench,
  "Plywood": Layers,
  "Doors": Package2,
};

export default function Reports() {
  const { data: stockReport, isLoading: stockLoading } = useQuery({
    queryKey: ["/api/reports/stock"],
    queryFn: reportsApi.getStockReport,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/stock-transactions"],
    queryFn: stockTransactionsApi.getAll,
  });

  const handleExportStock = () => {
    if (!stockReport) return;
    
    const csv = [
      ['Product Name', 'SKU', 'Category', 'Price', 'Quantity', 'Reorder Level', 'Status', 'Total Value'].join(','),
      ...stockReport.map(product => [
        product.name,
        product.sku,
        product.category,
        product.price,
        product.quantity,
        product.reorderLevel,
        product.stockStatus,
        (parseFloat(product.price) * product.quantity).toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportTransactions = () => {
    if (!transactions) return;
    
    const csv = [
      ['Date', 'Product', 'SKU', 'Type', 'Reason', 'Quantity', 'Unit Price', 'Total Value', 'Supplier/Customer'].join(','),
      ...transactions.map(transaction => [
        new Date(transaction.timestamp).toLocaleDateString(),
        transaction.productName,
        transaction.productSku,
        transaction.type,
        transaction.reason,
        transaction.quantity,
        transaction.unitPrice || '0',
        transaction.totalValue || '0',
        transaction.supplierName || transaction.customerName || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock-transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const lowStockProducts = stockReport?.filter(p => p.stockStatus === 'low-stock' || p.stockStatus === 'out-of-stock') || [];
  const totalStockValue = stockReport?.reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0) || 0;

  return (
    <>
      <Header 
        title="Reports" 
        subtitle="Analytics and insights for your inventory"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="total-products-count">
                    {stockReport?.length || 0}
                  </p>
                </div>
                <Package2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="low-stock-count">
                    {lowStockProducts.length}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stock Value</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="total-stock-value">
                    ${totalStockValue.toLocaleString()}
                  </p>
                </div>
                <Layers className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Report */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle>Current Stock Report</CardTitle>
              <Button 
                variant="outline" 
                onClick={handleExportStock}
                disabled={stockLoading || !stockReport}
                data-testid="export-stock-report"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {stockLoading ? (
              <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Product
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        SKU
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Price
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Stock
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Value
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stockReport?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      stockReport?.map((product) => {
                        const IconComponent = categoryIcons[product.category as keyof typeof categoryIcons] || Package2;
                        const totalValue = parseFloat(product.price) * product.quantity;
                        
                        return (
                          <tr key={product.id} className="hover:bg-muted/30" data-testid={`stock-report-product-${product.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-3">
                                  <IconComponent className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-foreground">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {product.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                              {product.sku}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                              ${parseFloat(product.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {product.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                              ${totalValue.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`status-badge ${
                                product.stockStatus === 'out-of-stock' ? 'status-out-of-stock' :
                                product.stockStatus === 'low-stock' ? 'status-low-stock' : 'status-in-stock'
                              }`}>
                                {product.stockStatus === 'out-of-stock' ? 'Out of Stock' :
                                 product.stockStatus === 'low-stock' ? 'Low Stock' : 'In Stock'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Movement History */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle>Stock Movement History</CardTitle>
              <Button 
                variant="outline" 
                onClick={handleExportTransactions}
                disabled={transactionsLoading || !transactions}
                data-testid="export-transactions"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {transactionsLoading ? (
              <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Date
                      </th>
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
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions?.slice(0, 20).map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-muted/30" data-testid={`transaction-history-${transaction.id}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {transaction.productName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.productSku}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            ${parseFloat(transaction.totalValue || '0').toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {transaction.supplierName || transaction.customerName || transaction.reason}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
