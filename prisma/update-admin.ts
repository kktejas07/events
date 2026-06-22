import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Omsairam@4522!!", 12);

  const oldAdmin = await prisma.user.findUnique({ where: { email: "admin@eventsplatform.com" } });

  if (oldAdmin) {
    if (oldAdmin.email !== "events@forgetechno.com") {
      await prisma.user.update({
        where: { id: oldAdmin.id },
        data: {
          email: "events@forgetechno.com",
          passwordHash: hash,
          role: Role.ADMIN,
        },
      });
      console.log("Updated admin email to events@forgetechno.com");
    } else {
      await prisma.user.update({
        where: { id: oldAdmin.id },
        data: { passwordHash: hash },
      });
      console.log("Updated admin password");
    }
  } else {
    await prisma.user.upsert({
      where: { email: "events@forgetechno.com" },
      update: { passwordHash: hash, role: Role.ADMIN },
      create: {
        email: "events@forgetechno.com",
        passwordHash: hash,
        firstName: "Admin",
        lastName: "User",
        role: Role.ADMIN,
      },
    });
    console.log("Created admin user events@forgetechno.com");
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
