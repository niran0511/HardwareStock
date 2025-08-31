import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import SupplierForm from "@/components/forms/supplier-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { suppliersApi } from "@/lib/api";
import type { Supplier } from "@shared/schema";

export default function Suppliers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: suppliersApi.getAll,
  });

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingSupplier(null);
  };

  return (
    <>
      <Header 
        title="Suppliers" 
        subtitle="Manage your supplier relationships"
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Supplier Directory</h3>
            <p className="text-sm text-muted-foreground">
              {suppliers ? `${suppliers.length} suppliers` : "Loading suppliers..."}
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="add-supplier-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <SupplierForm onSuccess={handleCloseDialog} />
            </DialogContent>
          </Dialog>

          <Dialog open={!!editingSupplier} onOpenChange={(open) => !open && setEditingSupplier(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Supplier</DialogTitle>
              </DialogHeader>
              <SupplierForm 
                supplier={editingSupplier} 
                onSuccess={handleCloseDialog} 
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : suppliers?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No suppliers found. Add your first supplier to get started.</p>
            </div>
          ) : (
            suppliers?.map((supplier) => (
              <Card key={supplier.id} className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEdit(supplier)} data-testid={`supplier-card-${supplier.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span data-testid={`supplier-name-${supplier.id}`}>{supplier.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {supplier.email && (
                      <div data-testid={`supplier-email-${supplier.id}`}>
                        📧 {supplier.email}
                      </div>
                    )}
                    {supplier.phone && (
                      <div data-testid={`supplier-phone-${supplier.id}`}>
                        📞 {supplier.phone}
                      </div>
                    )}
                    {supplier.address && (
                      <div data-testid={`supplier-address-${supplier.id}`}>
                        📍 {supplier.address}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
