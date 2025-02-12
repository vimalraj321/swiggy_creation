import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

async function searchProducts(query: string) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
      status: "In Stock",
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || "";
  const products = await searchProducts(query);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-3xl font-bold text-pink-900 sm:text-4xl">
          Search Results
        </h1>
        <p className="mt-4 text-lg text-pink-600">
          {products.length === 0
            ? "No products found"
            : `Found ${products.length} product${
                products.length === 1 ? "" : "s"
              } for "${query}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group relative"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            View all products
          </Link>
        </div>
      )}
    </div>
  );
}
