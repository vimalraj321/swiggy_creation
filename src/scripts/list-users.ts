import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.member.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    console.log("All users in database:", users);
  } catch (error) {
    console.error("Failed to list users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
listUsers();
