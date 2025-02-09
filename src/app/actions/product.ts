"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        material: true,
      },
    });
    return { products };
  } catch (error) {
    return { error: "Failed to fetch products" };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        material: true,
      },
    });
    return { product };
  } catch (error) {
    return { error: "Failed to fetch product" };
  }
}
