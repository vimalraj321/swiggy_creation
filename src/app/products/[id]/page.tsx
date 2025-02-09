"use client";

import { getProduct } from "@/app/actions/product";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useState, useEffect } from "react";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProduct(params.id);
      if (result.error) {
        setError(result.error);
      } else {
        setProduct(result.product);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (error || !product) {
    return notFound();
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.toString()),
      image: product.images[0],
    });

    // Reset animation after 1 second
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden rounded-3xl bg-white shadow-xl">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-cover object-center transform hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image: string, idx: number) => (
                <div
                  key={idx}
                  className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${idx + 2}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover object-center transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:pl-8">
            <div className="space-y-8 bg-white rounded-3xl p-8 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
                    {product.category.name}
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-primary-600">
                  ${product.price.toString()}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  ✨ About this piece
                </h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    💫 Why you'll love it
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2 text-gray-600">
                      <span className="text-primary-500">•</span>
                      <span>Unique design that stands out</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-600">
                      <span className="text-primary-500">•</span>
                      <span>Premium quality material</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-600">
                      <span className="text-primary-500">•</span>
                      <span>Perfect for any occasion</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full rounded-full bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-primary-500 ${
                  isAdding ? "animate-bounce" : ""
                }`}
              >
                {isAdding ? "Added! 🎉" : "Add to Bag 🛍️"}
              </button>

              {/* Social Proof */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span>(4.9/5)</span>
                  </div>
                  <span>1.2k+ happy customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
