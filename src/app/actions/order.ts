"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { orders };
  } catch {
    return { error: "Failed to fetch orders" };
  }
}

export async function getOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return { order };
  } catch {
    return { error: "Failed to fetch order" };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/orders");
    return { order };
  } catch {
    return { error: "Failed to update order status" };
  }
}

export async function createOrder(data: {
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}) {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        email: data.customerEmail,
        status: OrderStatus.PROCESSING,
        total: data.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
        items: {
          create: data.items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            product: {
              connect: {
                id: item.productId,
              },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    revalidatePath("/admin/orders");
    return { order };
  } catch {
    return { error: "Failed to create order" };
  }
}
