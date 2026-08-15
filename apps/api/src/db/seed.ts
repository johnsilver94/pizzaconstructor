import { connectDB, disconnectDB } from "./connection";
import { ProductModel } from "./models/Product";
import type { CategorySlug, SizePriceOption } from "@pizzaconstructor/shared";

interface SeedItem {
  name: string;
  category: CategorySlug;
  description: string;
  image: string;
  ingredients: { name: string }[];
  allergens: { name: string }[];
  sizePrices: SizePriceOption[];
}

export const seedCatalogData: SeedItem[] = [
  // --- PIZZAS ---
  {
    name: "Margherita Classica",
    category: "pizza",
    description: "Traditional Neapolitan recipe with San Marzano tomatoes, fresh buffalo mozzarella, and aromatic basil leaves.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Tomato Sauce" }, { name: "Buffalo Mozzarella" }, { name: "Fresh Basil" }, { name: "Extra Virgin Olive Oil" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 11.99, weightG: 500 },
      { size: "30cm (650gr)", price: 15.99, weightG: 650 },
      { size: "35cm (800gr)", price: 19.99, weightG: 800 },
    ],
  },
  {
    name: "Pepperoni Supreme",
    category: "pizza",
    description: "Generously loaded with spicy cured pepperoni slices, melted mozzarella, and signature tomato sauce.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Tomato Sauce" }, { name: "Mozzarella" }, { name: "Spicy Pepperoni" }, { name: "Oregano" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 13.99, weightG: 500 },
      { size: "30cm (650gr)", price: 17.99, weightG: 650 },
      { size: "35cm (800gr)", price: 21.99, weightG: 800 },
    ],
  },
  {
    name: "Quattro Formaggi",
    category: "pizza",
    description: "A rich four-cheese blend of creamy Mozzarella, aged Gorgonzola, Italian Parmesan, and melting Fontina.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Mozzarella" }, { name: "Gorgonzola" }, { name: "Parmesan" }, { name: "Fontina" }, { name: "White Truffle Oil" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 14.5, weightG: 500 },
      { size: "30cm (650gr)", price: 18.5, weightG: 650 },
      { size: "35cm (800gr)", price: 22.5, weightG: 800 },
    ],
  },
  {
    name: "Diavola Piccante",
    category: "pizza",
    description: "Fiery Italian salami, spicy calabrian chili flakes, roasted red peppers, and mozzarella.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Tomato Sauce" }, { name: "Mozzarella" }, { name: "Calabrian Salami" }, { name: "Chili Flakes" }, { name: "Red Onion" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 13.99, weightG: 500 },
      { size: "30cm (650gr)", price: 17.99, weightG: 650 },
      { size: "35cm (800gr)", price: 21.99, weightG: 800 },
    ],
  },
  {
    name: "Capricciosa Deluxe",
    category: "pizza",
    description: "Savory ham, button mushrooms, artichoke hearts, pitted black olives, and melted mozzarella.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Tomato Sauce" }, { name: "Mozzarella" }, { name: "Cooked Ham" }, { name: "Mushrooms" }, { name: "Artichokes" }, { name: "Black Olives" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 14.99, weightG: 500 },
      { size: "30cm (650gr)", price: 18.99, weightG: 650 },
      { size: "35cm (800gr)", price: 22.99, weightG: 800 },
    ],
  },
  {
    name: "Prosciutto e Funghi",
    category: "pizza",
    description: "Classic pairing of delicate cured prosciutto, fresh sautéed cremini mushrooms, and mozzarella.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Tomato Sauce" }, { name: "Mozzarella" }, { name: "Italian Prosciutto" }, { name: "Cremini Mushrooms" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 14.5, weightG: 500 },
      { size: "30cm (650gr)", price: 18.5, weightG: 650 },
      { size: "35cm (800gr)", price: 22.5, weightG: 800 },
    ],
  },
  {
    name: "BBQ Chicken Fiesta",
    category: "pizza",
    description: "Tender grilled chicken breast, smoky BBQ reduction, caramelized onions, cilantro, and smoked cheese.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "BBQ Sauce" }, { name: "Smoked Mozzarella" }, { name: "Grilled Chicken" }, { name: "Caramelized Onions" }, { name: "Cilantro" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 14.99, weightG: 500 },
      { size: "30cm (650gr)", price: 18.99, weightG: 650 },
      { size: "35cm (800gr)", price: 22.99, weightG: 800 },
    ],
  },
  {
    name: "Vegetariana Rustica",
    category: "pizza",
    description: "A garden feast of roasted zucchini, grilled bell peppers, eggplant, cherry tomatoes, and basil.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Tomato Sauce" }, { name: "Mozzarella" }, { name: "Roasted Zucchini" }, { name: "Bell Peppers" }, { name: "Mushrooms" }, { name: "Cherry Tomatoes" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }],
    sizePrices: [
      { size: "25cm (500gr)", price: 12.99, weightG: 500 },
      { size: "30cm (650gr)", price: 16.99, weightG: 650 },
      { size: "35cm (800gr)", price: 20.99, weightG: 800 },
    ],
  },

  // --- SALADS ---
  {
    name: "Caesar Gourmet",
    category: "salad",
    description: "Crisp romaine hearts, herb-marinated chicken breast, shaved Grana Padano, garlic focaccia croutons, and Caesar dressing.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Romaine Lettuce" }, { name: "Grilled Chicken" }, { name: "Parmesan Shavings" }, { name: "Croutons" }, { name: "Caesar Dressing" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }, { name: "Eggs" }],
    sizePrices: [
      { size: "Regular (300g)", price: 9.5, weightG: 300 },
      { size: "Large (450g)", price: 13.0, weightG: 450 },
    ],
  },
  {
    name: "Greek Traditional",
    category: "salad",
    description: "Sun-ripened tomatoes, crisp cucumbers, Kalamata olives, red onion, and authentic Greek feta sprinkled with oregano.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Cucumbers" }, { name: "Heirloom Tomatoes" }, { name: "Kalamata Olives" }, { name: "Feta Cheese" }, { name: "Red Onion" }, { name: "Oregano" }],
    allergens: [{ name: "Lactose" }],
    sizePrices: [
      { size: "Regular (300g)", price: 8.99, weightG: 300 },
      { size: "Large (450g)", price: 12.5, weightG: 450 },
    ],
  },
  {
    name: "Caprese Salad",
    category: "salad",
    description: "Thick slices of fresh mozzarella and vine-ripened tomatoes, drizzled with genovese pesto and aged balsamic glaze.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Fresh Mozzarella" }, { name: "Vine Tomatoes" }, { name: "Genovese Pesto" }, { name: "Balsamic Glaze" }],
    allergens: [{ name: "Lactose" }, { name: "Nuts" }],
    sizePrices: [
      { size: "Standard (280g)", price: 9.99, weightG: 280 },
    ],
  },
  {
    name: "Tuna & Avocado Fresh",
    category: "salad",
    description: "Flaked yellowfin tuna, sliced hass avocado, mixed baby greens, sweet corn, and a zesty lemon-dill vinaigrette.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Yellowfin Tuna" }, { name: "Hass Avocado" }, { name: "Baby Greens" }, { name: "Sweet Corn" }, { name: "Lemon Dressing" }],
    allergens: [{ name: "Fish" }],
    sizePrices: [
      { size: "Regular (320g)", price: 10.99, weightG: 320 },
      { size: "Large (480g)", price: 14.5, weightG: 480 },
    ],
  },

  // --- DESSERTS ---
  {
    name: "Tiramisu Artigianale",
    category: "desert",
    description: "Classic Italian dessert with espresso-dipped ladyfingers layered with velvety mascarpone and dusted with cocoa.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Savoiardi Ladyfingers" }, { name: "Espresso" }, { name: "Mascarpone Cream" }, { name: "Cocoa Powder" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }, { name: "Eggs" }],
    sizePrices: [
      { size: "Single Portion (180g)", price: 6.5, weightG: 180 },
    ],
  },
  {
    name: "Chocolate Lava Cake",
    category: "desert",
    description: "Warm molten Belgian chocolate cake with a gooey center, served alongside rich Madagascar vanilla gelato.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Belgian Chocolate" }, { name: "Butter" }, { name: "Flour" }, { name: "Vanilla Gelato" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }, { name: "Eggs" }],
    sizePrices: [
      { size: "Standard Portion (200g)", price: 7.5, weightG: 200 },
    ],
  },
  {
    name: "Panna Cotta al Lampone",
    category: "desert",
    description: "Silky Piedmontese vanilla cream infused with Madagascar vanilla bean, crowned with fresh raspberry coulis.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Heavy Cream" }, { name: "Vanilla Bean" }, { name: "Raspberry Coulis" }],
    allergens: [{ name: "Lactose" }],
    sizePrices: [
      { size: "Single Cup (160g)", price: 5.99, weightG: 160 },
    ],
  },
  {
    name: "Cheesecake New York",
    category: "desert",
    description: "Dense and creamy baked cheesecake on a buttery graham cracker crust with a swirl of forest berry compote.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Cream Cheese" }, { name: "Graham Crust" }, { name: "Berry Compote" }],
    allergens: [{ name: "Gluten" }, { name: "Lactose" }, { name: "Eggs" }],
    sizePrices: [
      { size: "Slice (190g)", price: 6.99, weightG: 190 },
    ],
  },

  // --- BEVERAGES ---
  {
    name: "Coca-Cola Classic (500ml)",
    category: "beverages",
    description: "Ice-cold refreshing classic Coca-Cola in a bottle.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Carbonated Water" }, { name: "Cane Sugar" }, { name: "Natural Flavors" }],
    allergens: [],
    sizePrices: [
      { size: "500ml Bottle", price: 2.99, weightG: 500 },
    ],
  },
  {
    name: "San Pellegrino Sparkling (750ml)",
    category: "beverages",
    description: "Premium Italian sparkling mineral water bottled at the source in the Italian Alps.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Natural Mineral Water" }, { name: "Carbonation" }],
    allergens: [],
    sizePrices: [
      { size: "750ml Glass Bottle", price: 3.99, weightG: 750 },
    ],
  },
  {
    name: "Fresh Orange Juice (400ml)",
    category: "beverages",
    description: "100% freshly squeezed Valencia oranges with natural citrus pulp and no added sugar.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Fresh Oranges" }],
    allergens: [],
    sizePrices: [
      { size: "400ml Glass", price: 4.5, weightG: 400 },
    ],
  },
  {
    name: "Italian Craft Beer (330ml)",
    category: "beverages",
    description: "Artisanal blonde lager brewed in Lombardy with crisp floral notes and a smooth malty finish.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Water" }, { name: "Barley Malt" }, { name: "Hops" }, { name: "Yeast" }],
    allergens: [{ name: "Gluten" }],
    sizePrices: [
      { size: "330ml Bottle (5.1% ABV)", price: 4.99, weightG: 330 },
    ],
  },

  // --- VEGAN ---
  {
    name: "Vegan Garden Pizza",
    category: "vegan",
    description: "Artisanal pizza made with organic dough, cashew-based mozzarella, grilled artichokes, roasted peppers, and baby spinach.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Tomato Sauce" }, { name: "Cashew Mozzarella" }, { name: "Artichokes" }, { name: "Roasted Peppers" }, { name: "Baby Spinach" }],
    allergens: [{ name: "Gluten" }, { name: "Nuts" }],
    sizePrices: [
      { size: "25cm (480gr)", price: 13.99, weightG: 480 },
      { size: "30cm (620gr)", price: 17.99, weightG: 620 },
      { size: "35cm (770gr)", price: 21.99, weightG: 770 },
    ],
  },
  {
    name: "Avocado Crunch Bowl",
    category: "vegan",
    description: "Wholesome warm quinoa, avocado slices, steamed edamame, shredded red cabbage, toasted sesame seeds, and ginger-tahini dressing.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Organic Quinoa" }, { name: "Avocado" }, { name: "Edamame" }, { name: "Sesame Seeds" }, { name: "Tahini Dressing" }],
    allergens: [{ name: "Soy" }],
    sizePrices: [
      { size: "Standard Bowl (350g)", price: 11.5, weightG: 350 },
    ],
  },
  {
    name: "Vegan Berry Crumble",
    category: "vegan",
    description: "Warm baked seasonal berries topped with an almond-oat crumble and served with chilled coconut cream.",
    image: "https://i.postimg.cc/44b1D01y/Rectangle-417.png",
    ingredients: [{ name: "Wild Berries" }, { name: "Rolled Oats" }, { name: "Almond Flour" }, { name: "Coconut Cream" }, { name: "Maple Syrup" }],
    allergens: [{ name: "Nuts" }, { name: "Gluten" }],
    sizePrices: [
      { size: "Single Cup (200g)", price: 6.99, weightG: 200 },
    ],
  },
];

export async function seedProducts(): Promise<{ seededCount: number; totalCount: number }> {
  await connectDB();

  console.log(`🔍 Checking database for existing products...`);
  const existingCount = await ProductModel.countDocuments();

  if (existingCount > 0) {
    console.log(`ℹ️ Database already has ${existingCount} products. Synchronizing seed items...`);
    for (const item of seedCatalogData) {
      await ProductModel.findOneAndUpdate(
        { name: item.name, category: item.category },
        { $set: item },
        { upsert: true, new: true }
      );
    }
  } else {
    console.log(`🌱 Seeding ${seedCatalogData.length} authentic PizzaConstructor products...`);
    await ProductModel.insertMany(seedCatalogData);
  }

  const totalCount = await ProductModel.countDocuments();
  console.log(`✅ Product seeding complete. Total products in catalog: ${totalCount}`);
  return { seededCount: seedCatalogData.length, totalCount };
}

// Run directly if invoked via CLI
if (import.meta.main) {
  seedProducts()
    .then(() => disconnectDB())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`❌ Seeding failed:`, err);
      process.exit(1);
    });
}
