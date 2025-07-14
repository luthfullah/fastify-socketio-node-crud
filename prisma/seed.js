// prisma/seed.js
import { PrismaClient } from "../src/generated/prisma/index.js"; // adjust if needed
const prisma = new PrismaClient();

async function main() {
  const products = [];

  for (let i = 1; i <= 100; i++) {
    products.push({
      name: `Product ${i}`,
      description: `Description of product ${i}`,
      price: parseFloat((Math.random() * 1000).toFixed(2)),
    });
  }

  await prisma.product.createMany({ data: products });

  console.log("✅ 100 products inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
