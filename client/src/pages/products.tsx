import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ProductsTable from "@/components/tables/products-table";
import ProductForm from "@/components/forms/product-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { productsApi } from "@/lib/api";
import type { Product } from "@shared/schema";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: searchQuery ? ["/api/products/search", searchQuery] : ["/api/products"],
    queryFn: () => searchQuery ? productsApi.search(searchQuery) : productsApi.getAll(),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <>
      <Header 
        title="Products" 
        subtitle="Manage your product inventory"
        onSearch={handleSearch}
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Product Catalog</h3>
            <p className="text-sm text-muted-foreground">
              {products ? `${products.length} products` : "Loading products..."}
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="add-product-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSuccess={handleCloseDialog} />
            </DialogContent>
          </Dialog>

          <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <ProductForm 
                product={editingProduct} 
                onSuccess={handleCloseDialog} 
              />
            </DialogContent>
          </Dialog>
        </div>

        <ProductsTable 
          products={products} 
          isLoading={isLoading} 
          onEdit={handleEdit}
        />
      </div>
    </>
  );
}
