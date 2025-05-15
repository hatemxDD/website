// seed to create fake users data
import { PrismaClient, Role, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users: Prisma.UserCreateManyInput[] = [];

  // Create 2 TeamLeaders
  for (let i = 0; i < 2; i++) {
    const password = await bcrypt.hash("password123", 10);
    users.push({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password,
      role: Role.TeamLeader,
    });
  }

  // Create 10 TeamMembers
  for (let i = 0; i < 10; i++) {
    const password = await bcrypt.hash("password123", 10);
    users.push({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password,
      role: Role.TeamMember,
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log("✅ Seeded users successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
