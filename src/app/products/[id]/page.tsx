import { getProduct } from "@/app/actions/product";
import Link from "next/link";
import ProductDetails from "./ProductDetails";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const { product, error } = await getProduct(id);

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-100 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            {`The product you're looking for doesn't exist or has been removed.`}
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
