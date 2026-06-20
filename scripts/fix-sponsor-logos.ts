import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing sponsor logo URLs...");

  const sponsors = await prisma.sponsor.findMany({
    where: {
      logoUrl: { contains: "via.placeholder.com" },
    },
  });

  console.log(`Found ${sponsors.length} sponsors with placeholder.com URLs`);

  for (const sponsor of sponsors) {
    await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { logoUrl: "" },
    });
    console.log(`  Fixed: ${sponsor.name} (${sponsor.id})`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
