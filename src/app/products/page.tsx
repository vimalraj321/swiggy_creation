import { getProducts } from "../actions/product";
import ProductCard from "../../components/ProductCard";

export default async function ProductsPage() {
  const { products, error } = await getProducts();

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="min-h-screen   bg-gradient-to-b from-primary-100 via-white to-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8 py-16">
            <div className="text-center space-y-4">
              <span className="inline-block text-4xl animate-bounce">💎</span>
              <h1 className="text-4xl font-bold text-primary-600">
                Discover Your Sparkle
              </h1>
              <p className="max-w-2xl text-center text-lg text-gray-600">
                Level up your style game with our trendy collection ✨
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              {["All", "New Arrivals", "Bestsellers", "Limited Edition"].map(
                (filter) => (
                  <button
                    key={filter}
                    className="px-6 py-2 rounded-full bg-white shadow-soft hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-primary-600 font-medium border border-primary-100"
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-16">
            {products?.map((product) => (
              <div
                key={product.id}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Quick Tips */}
        </div>
      </div>
    </div>
  );
}
