import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package2, Wrench, Layers, AlertCircle } from "lucide-react";
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
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg font-bold">Low Stock Alerts</CardTitle>
            </div>
            <Button variant="link" size="sm" className="text-purple-600 hover:text-purple-700">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 animate-slide-up">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Low Stock Alerts</CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Items need restocking</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 font-semibold rounded-lg" 
            data-testid="view-all-low-stock"
          >
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                  Product
                </th>
                <th className="text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                  SKU
                </th>
                <th className="text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                  Current Stock
                </th>
                <th className="text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                  Reorder Level
                </th>
                <th className="text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                        <Package2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">No low stock alerts at this time</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">All products are well stocked!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products?.map((product, index) => {
                  const IconComponent = categoryIcons[product.category as keyof typeof categoryIcons] || Package2;
                  
                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20 transition-all duration-200 cursor-pointer animate-slide-in-right" 
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`low-stock-product-${product.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                            <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100" data-testid={`product-name-${product.id}`}>
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md" data-testid={`product-sku-${product.id}`}>
                          {product.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-testid={`product-stock-${product.id}`}>
                        <span className={`text-sm font-bold ${
                          product.quantity === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">
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
