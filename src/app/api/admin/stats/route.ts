import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total sales from delivered orders
    const orders = await prisma.order.findMany({
      where: {
        status: "DELIVERED",
      },
      select: {
        total: true,
      },
    });
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get total products
    const totalProducts = await prisma.product.count();

    // Get low stock products (less than 10 items)
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: {
          lt: 10,
          gt: 0,
        },
      },
    });

    return NextResponse.json({
      totalSales,
      totalOrders,
      totalProducts,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        error: "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}
