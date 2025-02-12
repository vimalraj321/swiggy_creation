import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Order, OrderItem, Product } from "@prisma/client";

interface OrderWithRelations extends Order {
  customerName: string;
  email: string;
  items: (OrderItem & {
    product: Pick<Product, "name">;
  })[];
}

export async function GET() {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        total: true,
        status: true,
        customerName: true,
        email: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(recentOrders);
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}
