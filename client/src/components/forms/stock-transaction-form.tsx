import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { stockTransactionsApi, productsApi, suppliersApi, customersApi } from "@/lib/api";
import { insertStockTransactionSchema } from "@shared/schema";
import type { InsertStockTransaction } from "@shared/schema";

interface StockTransactionFormProps {
  type: 'in' | 'out';
  onSuccess?: () => void;
}

const reasonOptions = {
  in: [
    { value: 'purchase', label: 'Purchase' },
    { value: 'return', label: 'Customer Return' },
    { value: 'adjustment', label: 'Inventory Adjustment' },
  ],
  out: [
    { value: 'sale', label: 'Sale' },
    { value: 'wastage', label: 'Wastage/Damage' },
    { value: 'adjustment', label: 'Inventory Adjustment' },
  ],
};

export default function StockTransactionForm({ type, onSuccess }: StockTransactionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    queryFn: productsApi.getAll,
  });

  const { data: suppliers } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: suppliersApi.getAll,
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: customersApi.getAll,
  });

  const form = useForm<InsertStockTransaction>({
    resolver: zodResolver(insertStockTransactionSchema),
    defaultValues: {
      productId: "",
      type,
      reason: "",
      quantity: 0,
      unitPrice: "0",
      totalValue: "0",
      supplierId: "",
      customerId: "",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: stockTransactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stock-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: `Stock ${type} transaction recorded successfully`,
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record transaction",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStockTransaction) => {
    // Calculate total value
    const quantity = data.quantity;
    const unitPrice = parseFloat(data.unitPrice || "0");
    const totalValue = (quantity * unitPrice).toFixed(2);
    
    createMutation.mutate({
      ...data,
      totalValue,
    });
  };

  const watchQuantity = form.watch("quantity");
  const watchUnitPrice = form.watch("unitPrice");
  const totalValue = (watchQuantity * parseFloat(watchUnitPrice || "0")).toFixed(2);

  const watchReason = form.watch("reason");
  const showSupplier = type === 'in' && (watchReason === 'purchase' || watchReason === 'return');
  const showCustomer = type === 'out' && watchReason === 'sale';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="product-select">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {product.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="reason-select">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reasonOptions[type].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  data-testid="quantity-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field}
                  value={field.value || ""} 
                  data-testid="unit-price-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-muted-foreground">
          Total Value: <span className="font-medium text-foreground">${totalValue}</span>
        </div>

        {showSupplier && (
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="supplier-select">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers?.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showCustomer && (
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="customer-select">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes..." 
                  {...field}
                  value={field.value || ""} 
                  data-testid="notes-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={createMutation.isPending}
          className="w-full"
          data-testid="submit-transaction"
        >
          {createMutation.isPending ? "Recording..." : `Record Stock ${type === 'in' ? 'In' : 'Out'}`}
        </Button>
      </form>
    </Form>
  );
}
