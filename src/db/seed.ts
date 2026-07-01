import "dotenv/config";
import { db, pool } from "./index";
import { categories, products, reviews } from "./schema";
import { categorySeed, productSeed, reviewSeed } from "./seed-data";

async function main() {
  console.log("Seeding AfruzStore...");

  await db.delete(reviews);
  await db.delete(products);
  await db.delete(categories);

  await db.insert(categories).values(categorySeed);
  console.log(`Inserted ${categorySeed.length} categories`);

  await db.insert(products).values(productSeed);
  console.log(`Inserted ${productSeed.length} products`);

  await db.insert(reviews).values(reviewSeed);
  console.log(`Inserted ${reviewSeed.length} reviews`);

  console.log("Seed complete.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
