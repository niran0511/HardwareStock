import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package2, Wrench, Layers } from "lucide-react";
import type { ProductWithStock } from "@shared/schema";

interface LowStockTableProps {
  products?: ProductWithStock[];
  isLoading: boolean;
}

const categoryIcons = {
  "Handles": Package2,
  "Hardware": Wrench,
  "Plywood": Layers,
  "Doors": Package2,
};

export default function LowStockTable({ products, isLoading }: LowStockTableProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>Low Stock Alerts</CardTitle>
            <Button variant="link" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle>Low Stock Alerts</CardTitle>
          <Button variant="link" size="sm" data-testid="view-all-low-stock">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
                  Current Stock
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Reorder Level
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No low stock alerts at this time
                  </td>
                </tr>
              ) : (
                products?.map((product) => {
                  const IconComponent = categoryIcons[product.category as keyof typeof categoryIcons] || Package2;
                  
                  return (
                    <tr key={product.id} className="hover:bg-muted/30" data-testid={`low-stock-product-${product.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-3">
                            <IconComponent className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground" data-testid={`product-name-${product.id}`}>
                              {product.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" data-testid={`product-sku-${product.id}`}>
                        {product.id.slice(0, 8)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        product.quantity === 0 ? 'text-red-600' : 'text-yellow-600'
                      }`} data-testid={`product-stock-${product.id}`}>
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {product.reorderLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${
                          product.stockStatus === 'out-of-stock' ? 'status-out-of-stock' :
                          product.stockStatus === 'low-stock' ? 'status-low-stock' : 'status-in-stock'
                        }`} data-testid={`product-status-${product.id}`}>
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
      </CardContent>
    </Card>
  );
}
