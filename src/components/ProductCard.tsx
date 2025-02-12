import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product & {
    category: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-t-2xl bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" /> */}
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
            {product.category.name}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between pt-2">
          <span
            className={`text-sm font-medium ${
              product.stock > 10
                ? "text-green-600"
                : product.stock > 0
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {product.stock > 10
              ? "In Stock"
              : product.stock > 0
              ? "Low Stock"
              : "Out of Stock"}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
