// seed to create fake users data
import { PrismaClient, Role, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // const users: Prisma.UserCreateManyInput[] = [];

  // // Create 2 TeamLeaders
  // for (let i = 0; i < 2; i++) {
  //   const password = await bcrypt.hash("password123", 10);
  //   users.push({
  //     email: faker.internet.email(),
  //     name: faker.person.fullName(),
  //     password,
  //     role: Role.TeamLeader,
  //   });
  // }

  // // Create 10 TeamMembers
  // for (let i = 0; i < 10; i++) {
  //   const password = await bcrypt.hash("password123", 10);
  //   users.push({
  //     email: faker.internet.email(),
  //     name: faker.person.fullName(),
  //     password,
  //     role: Role.TeamMember,
  //   });
  // }

  // await prisma.user.createMany({
  //   data: users,
  // });

  // console.log("✅ Seeded users successfully!");

  // Get all users to assign as news authors
  const allUsers = await prisma.user.findMany();

  // Create 5 news entries
  const newsCategories = [
    "general",
    "science",
    "technology",
    "events",
    "achievements",
  ];
  const newsStatus = ["published", "draft"];

  for (let i = 0; i < 5; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

    await prisma.news.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        image: faker.image.url({ width: 640, height: 480 }),
        category: newsCategories[i % newsCategories.length],
        status: newsStatus[Math.floor(Math.random() * newsStatus.length)],
        publishDate: faker.date.between({
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }),
        authorId: 2,
      },
    });
  }

  console.log("✅ Seeded news successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
