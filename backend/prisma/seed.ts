// seed to update profile pictures for existing users
import { PrismaClient, Role, Prisma, ProjectState } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Get all existing users
  const existingUsers = await prisma.user.findMany();

  if (existingUsers.length === 0) {
    console.log("No users found in the database. No updates were made.");
    return;
  }

  console.log(`Found ${existingUsers.length} existing users to update.`);

  // Define female users by ID
  const femaleUserIds = [12, 15, 17, 19, 21];

  // Generate unique indices for photos to avoid repetition
  const malePhotoIndices = Array.from({ length: 10 }, (_, i) => i + 1);
  const femalePhotoIndices = Array.from({ length: 5 }, (_, i) => i + 1);

  // Shuffle the arrays to get random photos
  malePhotoIndices.sort(() => Math.random() - 0.5);
  femalePhotoIndices.sort(() => Math.random() - 0.5);

  // Keep track of which indices we've used
  let maleIndexUsed = 0;
  let femaleIndexUsed = 0;

  // Update each user with an appropriate headshot
  for (const user of existingUsers) {
    // Determine if this user should have a female photo
    const isFemale = femaleUserIds.includes(user.id);

    // Create a professional headshot style image
    let avatarUrl;
    if (isFemale) {
      // Use a female photo, cycling through the available indices
      const photoIndex =
        femalePhotoIndices[femaleIndexUsed % femalePhotoIndices.length];
      avatarUrl = `https://randomuser.me/api/portraits/women/${photoIndex}.jpg`;
      femaleIndexUsed++;
    } else {
      // Use a male photo, cycling through the available indices
      const photoIndex =
        malePhotoIndices[maleIndexUsed % malePhotoIndices.length];
      avatarUrl = `https://randomuser.me/api/portraits/men/${photoIndex}.jpg`;
      maleIndexUsed++;
    }

    // Update user's image
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: avatarUrl,
        updatedAt: new Date(),
      },
    });

    console.log(
      `Updated profile picture for user: ${user.name} (ID: ${
        user.id
      }, Gender: ${isFemale ? "female" : "male"})`
    );
  }

  console.log(
    `✅ Successfully updated profile pictures for ${
      existingUsers.length
    } users (${femaleUserIds.length} females, ${
      existingUsers.length - femaleUserIds.length
    } males)`
  );
}

main()
  .catch((e) => {
    console.error("❌ Profile picture update failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
