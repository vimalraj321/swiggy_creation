import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    const admin = await prisma.member.findFirst({
      where: {
        role: "admin",
      },
    });

    if (admin) {
      console.log("Admin user found:", {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });
    } else {
      console.log("No admin user found in the database");
    }
  } catch (error) {
    console.error("Failed to check admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
checkAdminUser();
