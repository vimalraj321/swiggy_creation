import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // First create a test category if it doesn't exist
    let category = await prisma.category.findFirst({
      where: { name: "Test Category" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: "Test Category" },
      });
    }

    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "This is a test product to verify database connection",
        price: 99.99,
        stock: 100,
        images: ["/uploads/test-image.jpg"],
        categoryId: category.id,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      { error: "Failed to create test product" },
      { status: 500 }
    );
  }
}
