import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateAdminUser() {
  try {
    const admin = await prisma.member.findFirst({
      where: {
        role: "admin",
      },
    });

    if (!admin) {
      console.log("No admin user found to update");
      return;
    }

    const updatedAdmin = await prisma.member.update({
      where: {
        id: admin.id,
      },
      data: {
        email: "admin@sugicreation.com",
      },
    });

    console.log("Admin user updated successfully:", {
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      name: updatedAdmin.name,
      role: updatedAdmin.role,
    });
  } catch (error) {
    console.error("Failed to update admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateAdminUser();
