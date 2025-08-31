import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema,
  insertSupplierSchema, 
  insertCustomerSchema,
  insertStockTransactionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validation = insertProductSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validation.error.issues });
      }
      
      // Check for duplicate SKU
      const existingProduct = await storage.getProductsBySku(validation.data.sku);
      if (existingProduct) {
        return res.status(400).json({ message: "Product with this SKU already exists" });
      }

      const product = await storage.createProduct(validation.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validation = insertProductSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validation.error.issues });
      }

      const product = await storage.updateProduct(req.params.id, validation.data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validation = insertSupplierSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid supplier data", errors: validation.error.issues });
      }

      const supplier = await storage.createSupplier(validation.data);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const validation = insertSupplierSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid supplier data", errors: validation.error.issues });
      }

      const supplier = await storage.updateSupplier(req.params.id, validation.data);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSupplier(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validation = insertCustomerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid customer data", errors: validation.error.issues });
      }

      const customer = await storage.createCustomer(validation.data);
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const validation = insertCustomerSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid customer data", errors: validation.error.issues });
      }

      const customer = await storage.updateCustomer(req.params.id, validation.data);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Stock Transactions
  app.get("/api/stock-transactions", async (req, res) => {
    try {
      const transactions = await storage.getStockTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock transactions" });
    }
  });

  app.get("/api/stock-transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getStockTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ message: "Stock transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock transaction" });
    }
  });

  app.post("/api/stock-transactions", async (req, res) => {
    try {
      const validation = insertStockTransactionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid transaction data", errors: validation.error.issues });
      }

      // Verify product exists
      const product = await storage.getProduct(validation.data.productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      const transaction = await storage.createStockTransaction(validation.data);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create stock transaction" });
    }
  });

  app.get("/api/products/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getStockTransactionsByProduct(req.params.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product transactions" });
    }
  });

  // Dashboard & Reports
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/low-stock", async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.get("/api/dashboard/recent-activity", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activity = await storage.getRecentActivity(limit);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  app.get("/api/dashboard/categories", async (req, res) => {
    try {
      const categories = await storage.getCategorySummary();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category summary" });
    }
  });

  app.get("/api/reports/stock", async (req, res) => {
    try {
      const report = await storage.getStockReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate stock report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
