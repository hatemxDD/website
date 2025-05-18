// seed to create fake users data
import { PrismaClient, Role, Prisma, ProjectState } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users: Prisma.UserCreateManyInput[] = [];

  // Get created users
  const createdUsers = await prisma.user.findMany();

  // Create teams
  const teamNames = [
    "Quantum Computing",
    "Artificial Intelligence",
    "Robotics",
  ];
  const teamAcros = ["QC", "AI", "ROB"];

  for (let i = 0; i < 3; i++) {
    // Find a team leader
    const leader = createdUsers.find(
      (u) => u.role === "TeamLeader" && !u.email.includes("used")
    );

    if (leader) {
      // Mark this leader as used (simple way to avoid reusing the same leader)
      leader.email = leader.email + ".used";

      await prisma.team.create({
        data: {
          name: teamNames[i],
          acro: teamAcros[i],
          description: faker.lorem.paragraph(),
          leaderId: leader.id,
          memberUsers: {
            connect: createdUsers
              .filter((u) => u.role === "TeamMember")
              .slice(i * 3, i * 3 + 3)
              .map((u) => ({ id: u.id })),
          },
        },
      });
    }
  }

  // Create articles for some users
  for (let i = 0; i < 5; i++) {
    const randomUser =
      createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const coAuthors = createdUsers
      .filter((u) => u.id !== randomUser.id)
      .slice(0, Math.floor(Math.random() * 3)); // 0-2 co-authors

    await prisma.article.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(5),
        publishDate: faker.date.past(),
        authorId: randomUser.id,
        pdfLink: Math.random() > 0.5 ? faker.internet.url() : null,
        journalLink: Math.random() > 0.5 ? faker.internet.url() : null,
        coAuthors: {
          connect: coAuthors.map((u) => ({ id: u.id })),
        },
      },
    });
  }

  console.log(
    `✅ Seeding completed: ${users.length} users created, with teams and articles`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
