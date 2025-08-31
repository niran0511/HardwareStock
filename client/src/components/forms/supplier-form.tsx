import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { suppliersApi } from "@/lib/api";
import { insertSupplierSchema } from "@shared/schema";
import type { Supplier, InsertSupplier } from "@shared/schema";

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSuccess?: () => void;
}

export default function SupplierForm({ supplier, onSuccess }: SupplierFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSupplier>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      name: supplier?.name || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      address: supplier?.address || "",
      isActive: supplier?.isActive ?? true,
    },
  });

  const createMutation = useMutation({
    mutationFn: suppliersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Supplier created successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create supplier",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertSupplier>) => suppliersApi.update(supplier!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Supplier updated successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update supplier",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => suppliersApi.delete(supplier!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete supplier",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSupplier) => {
    if (supplier) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (supplier && window.confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      deleteMutation.mutate();
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter supplier name" {...field} data-testid="supplier-name-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="supplier@example.com" 
                    {...field} 
                    data-testid="supplier-email-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} data-testid="supplier-phone-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter supplier address" 
                  {...field} 
                  data-testid="supplier-address-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Supplier</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable this supplier for new transactions
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="supplier-active-switch"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <div>
            {supplier && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isLoading}
                data-testid="supplier-delete-button"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Supplier"}
              </Button>
            )}
          </div>
          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess}
              data-testid="supplier-form-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="supplier-form-submit"
            >
              {isLoading ? "Saving..." : (supplier ? "Update Supplier" : "Create Supplier")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
