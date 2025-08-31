import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Package2, Wrench, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productsApi } from "@/lib/api";
import type { Product } from "@shared/schema";

interface ProductsTableProps {
  products?: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
}

const categoryIcons = {
  "Handles": Package2,
  "Hardware": Wrench,
  "Plywood": Layers,
  "Doors": Package2,
};

export default function ProductsTable({ products, isLoading, onEdit }: ProductsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= product.reorderLevel) return 'low-stock';
    return 'in-stock';
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
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
                  Price
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Stock
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                products?.map((product) => {
                  const IconComponent = categoryIcons[product.category as keyof typeof categoryIcons] || Package2;
                  const stockStatus = getStockStatus(product);
                  
                  return (
                    <tr key={product.id} className="hover:bg-muted/30" data-testid={`product-row-${product.id}`}>
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
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" data-testid={`product-price-${product.id}`}>
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" data-testid={`product-quantity-${product.id}`}>
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${
                          stockStatus === 'out-of-stock' ? 'status-out-of-stock' :
                          stockStatus === 'low-stock' ? 'status-low-stock' : 'status-in-stock'
                        }`} data-testid={`product-status-${product.id}`}>
                          {stockStatus === 'out-of-stock' ? 'Out of Stock' :
                           stockStatus === 'low-stock' ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(product)}
                            data-testid={`edit-product-${product.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            disabled={deleteMutation.isPending}
                            data-testid={`delete-product-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
