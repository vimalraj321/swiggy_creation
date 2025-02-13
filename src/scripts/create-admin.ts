import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = "admin@sugicreation.com";
  const password = "Admin@123";
  const name = "Admin User";

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.member.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.member.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Admin user created successfully:", {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error) {
    console.error("Failed to create admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createAdminUser();
