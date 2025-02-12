import { prisma } from "@/lib/prisma";
import { Order, OrderStatus } from "@prisma/client";
import Image from "next/image";
type OrderWithItems = Order & {
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      <div className="space-y-8">
        {orders.map((order: OrderWithItems) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === OrderStatus.PROCESSING
                    ? "bg-blue-100 text-blue-800"
                    : order.status === OrderStatus.SHIPPED
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === OrderStatus.DELIVERED
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0] || ""}
                            alt={item.product.name || ""}
                            className="object-cover object-center w-full h-full"
                          />
                        )}
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.product.name}</h3>
                            <p className="ml-4">
                              ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>₹{order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
