import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import CustomerForm from "@/components/forms/customer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { customersApi } from "@/lib/api";
import type { Customer } from "@shared/schema";

export default function Customers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: customersApi.getAll,
  });

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingCustomer(null);
  };

  return (
    <>
      <Header 
        title="Customers" 
        subtitle="Manage your customer relationships"
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Customer Directory</h3>
            <p className="text-sm text-muted-foreground">
              {customers ? `${customers.length} customers` : "Loading customers..."}
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="add-customer-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <CustomerForm onSuccess={handleCloseDialog} />
            </DialogContent>
          </Dialog>

          <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Customer</DialogTitle>
              </DialogHeader>
              <CustomerForm 
                customer={editingCustomer} 
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
          ) : customers?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No customers found. Add your first customer to get started.</p>
            </div>
          ) : (
            customers?.map((customer) => (
              <Card key={customer.id} className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEdit(customer)} data-testid={`customer-card-${customer.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span data-testid={`customer-name-${customer.id}`}>{customer.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {customer.email && (
                      <div data-testid={`customer-email-${customer.id}`}>
                        📧 {customer.email}
                      </div>
                    )}
                    {customer.phone && (
                      <div data-testid={`customer-phone-${customer.id}`}>
                        📞 {customer.phone}
                      </div>
                    )}
                    {customer.address && (
                      <div data-testid={`customer-address-${customer.id}`}>
                        📍 {customer.address}
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
