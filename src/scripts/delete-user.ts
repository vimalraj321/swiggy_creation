import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteUser() {
  const emailToDelete = "admin@swiggy.com";

  try {
    const deletedUser = await prisma.member.delete({
      where: {
        email: emailToDelete,
      },
    });

    console.log("User deleted successfully:", {
      id: deletedUser.id,
      email: deletedUser.email,
      name: deletedUser.name,
      role: deletedUser.role,
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
deleteUser();
