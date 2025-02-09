import { getProducts } from "./actions/product";
import ProductCard from "../components/ProductCard";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const { products } = await getProducts();

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('/sparkles.png')] opacity-20 animate-twinkle" />
        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center sm:mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in">
              Welcome to Swiggy Creation 💝
            </h1>
            <p className="mt-6 text-xl text-white/90 animate-slide-up">
              Discover our exquisite collection of handcrafted jewelry that
              tells your unique story
            </p>
            <div className="mt-10 space-x-4">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
              >
                Explore Collection 💫
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block animate-bounce mb-2">✨</span>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-primary-400 text-transparent bg-clip-text">
            Featured Collection
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Handpicked pieces that define elegance and style
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products?.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="transform hover:scale-105 transition-all duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 text-lg font-semibold text-primary-600 hover:text-primary-500 transform hover:translate-x-2 transition-all duration-300"
          >
            <span>View All Collections</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gradient-to-b from-white to-primary-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block animate-pulse mb-2">💝</span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Find the perfect piece for every occasion
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Necklaces",
                emoji: "✨",
                color: "from-pink-400 to-primary-400",
              },
              {
                name: "Rings",
                emoji: "💍",
                color: "from-primary-400 to-purple-400",
              },
              {
                name: "Earrings",
                emoji: "⭐",
                color: "from-purple-400 to-pink-400",
              },
            ].map((category) => (
              <div
                key={category.name}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-h-3 aspect-w-4">
                  <div
                    className={`h-full w-full bg-gradient-to-r ${category.color}`}
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all duration-300">
                  <span className="text-4xl mb-2">{category.emoji}</span>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block animate-spin-slow mb-2">💫</span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            #SwiggyCreation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Join our community of happy customers sharing their favorite pieces
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-primary-100 rounded-2xl overflow-hidden hover:opacity-75 transition-opacity duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
