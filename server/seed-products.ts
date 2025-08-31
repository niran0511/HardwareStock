import { storage } from "./storage";

// Predefined products with prices
const predefinedProducts = [
  { name: "Door Handle", category: "Hardware", price: "300", quantity: 0 },
  { name: "Padlock", category: "Hardware", price: "700", quantity: 0 },
  { name: "Mortise Lock", category: "Hardware", price: "500", quantity: 0 },
  { name: "Hinges", category: "Hardware", price: "600", quantity: 0 },
  { name: "Door Closer", category: "Hardware", price: "800", quantity: 0 },
  { name: "Drawer Slide", category: "Hardware", price: "0", quantity: 0 },
  { name: "Plywood Sheet", category: "Plywood", price: "0", quantity: 0 },
  { name: "MDF Board", category: "Plywood", price: "0", quantity: 0 },
  { name: "Screws", category: "Hardware", price: "0", quantity: 0 },
  { name: "Nails", category: "Hardware", price: "0", quantity: 0 },
  { name: "Bolts", category: "Hardware", price: "0", quantity: 0 },
  { name: "Nuts", category: "Hardware", price: "0", quantity: 0 },
  { name: "Washers", category: "Hardware", price: "0", quantity: 0 },
  { name: "Angle Bracket", category: "Hardware", price: "0", quantity: 0 },
  { name: "Wall Plug", category: "Hardware", price: "0", quantity: 0 },
  { name: "Door Stopper", category: "Hardware", price: "0", quantity: 0 },
  { name: "Cabinet Knob", category: "Hardware", price: "0", quantity: 0 },
  { name: "Window Latch", category: "Hardware", price: "0", quantity: 0 },
  { name: "Tower Bolt", category: "Hardware", price: "0", quantity: 0 },
  { name: "Hasps & Staples", category: "Hardware", price: "0", quantity: 0 }
];

export async function seedProducts() {
  console.log("Starting product seeding...");
  
  try {
    // Check if products already exist
    const existingProducts = await storage.getProducts();
    console.log(`Found ${existingProducts.length} existing products`);
    
    for (const productData of predefinedProducts) {
      // Check if product already exists by name
      const existingProduct = existingProducts.find(p => p.name === productData.name);
      
      if (!existingProduct) {
        await storage.createProduct({
          name: productData.name,
          category: productData.category,
          price: productData.price,
          quantity: productData.quantity,
          description: null
        });
        console.log(`✓ Created product: ${productData.name} - ₹${productData.price}`);
      } else {
        console.log(`- Product already exists: ${productData.name}`);
      }
    }
    
    console.log("Product seeding completed successfully!");
    return { success: true, message: "All products seeded successfully" };
  } catch (error) {
    console.error("Error seeding products:", error);
    return { success: false, error: error.message };
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts().then((result) => {
    if (result.success) {
      console.log("✅ Seeding completed");
      process.exit(0);
    } else {
      console.error("❌ Seeding failed:", result.error);
      process.exit(1);
    }
  });
}