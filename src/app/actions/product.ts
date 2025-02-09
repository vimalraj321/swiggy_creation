"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { error: "Failed to fetch products" };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return { product };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { error: "Failed to fetch product" };
  }
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
}) {
  try {
    // First check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return { error: "Category not found" };
    }

    // Create the product with the correct status
    const status =
      data.stock > 0
        ? data.stock < 10
          ? "Low Stock"
          : "In Stock"
        : "Out of Stock";

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        images: data.images,
        status,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/admin/products");
    return { product };
  } catch (error) {
    console.error("Failed to create product:", error);
    console.error("Product data:", {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      images: data.images,
    });
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string;
    images?: string[];
  }
) {
  try {
    // If categoryId is provided, check if it exists
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        return { error: "Category not found" };
      }
    }

    // Calculate new status if stock is being updated
    const status =
      data.stock !== undefined
        ? data.stock > 0
          ? data.stock < 10
            ? "Low Stock"
            : "In Stock"
          : "Out of Stock"
        : undefined;

    const updateData = {
      ...data,
      status,
    };

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    revalidatePath("/admin/products");
    return { product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { error: "Failed to delete product" };
  }
}
