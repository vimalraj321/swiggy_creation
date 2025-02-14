"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: {
    name: string;
  };
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem, updateQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.toString()),
      image: product.images[0],
    });

    // If quantity is more than 1, update it after adding
    if (quantity > 1) {
      updateQuantity(product.id, quantity);
    }

    toast.success("Added to cart!");

    // Reset animation after 1 second
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 via-white to-primary-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden rounded-3xl bg-white shadow-soft border border-primary-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-cover object-center transform hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-2xl bg-white shadow-soft border transition-all duration-300 ${
                    selectedImage === idx
                      ? "border-primary-500 ring-2 ring-primary-500 ring-offset-2"
                      : "border-primary-100 hover:border-primary-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${idx + 1}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:pl-8">
            <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-primary-100">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full border border-primary-100">
                    {product.category.name}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      product.stock > 10
                        ? "text-green-600 bg-green-50 border border-green-100"
                        : product.stock > 0
                        ? "text-yellow-600 bg-yellow-50 border border-yellow-100"
                        : "text-red-600 bg-red-50 border border-red-100"
                    }`}
                  >
                    {product.stock > 10
                      ? "In Stock"
                      : product.stock > 0
                      ? "Low Stock"
                      : "Out of Stock"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
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
                    💫 Why you&apos;ll love it
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

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full rounded-full px-8 py-4 text-base font-semibold text-white shadow-soft hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    isAdding
                      ? "animate-bounce bg-green-500"
                      : product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-500"
                  }`}
                >
                  {isAdding
                    ? "Added! 🎉"
                    : product.stock === 0
                    ? "Out of Stock"
                    : "Add to Bag 🛍️"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
