import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product & {
    category: { name: string };
    material: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={500}
          height={500}
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-4 space-y-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500">
          {product.category.name} • {product.material.name}
        </p>
        <p className="text-lg font-semibold text-primary-600">
          ${product.price.toString()}
        </p>
      </div>
    </div>
  );
}
