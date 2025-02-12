import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Category, Product } from "@prisma/client";
import ProductCard from "@/components/ProductCard";

type CategoryWithProducts = Category & {
  products: Product[];
};

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { status: "In Stock" },
        take: 4,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return categories as CategoryWithProducts[];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary-900">
        Our Collections
      </h1>

      <div className="space-y-16">
        {categories.map((category) => (
          <div key={category.id} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-primary-800">
                {category.name}
              </h2>
              {/* <Link
                href={`/categories/${category.id}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, category: { name: category.name } }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
