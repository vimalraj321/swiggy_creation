"use client";

import { useState, useEffect } from "react";
import { getProducts, updateProduct } from "@/app/actions/product";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  stock: number;
  status: string;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, low, out
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await getProducts();
      if (result.products) {
        setProducts(result.products);
      }
    } catch {
      toast.error("Failed to fetch products");
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) throw new Error("Failed to create category");

      toast.success("Category created successfully!");
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      await updateProduct(id, { stock: newStock });
      toast.success("Stock updated successfully!");
      fetchProducts();
    } catch {
      toast.error("Failed to update stock");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStockFilter =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock < 10 && product.stock > 0) ||
      (stockFilter === "out" && product.stock === 0);

    return matchesSearch && matchesStockFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <button
          onClick={() => fetchProducts()}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500"
        >
          Refresh Stock
        </button>
      </div>

      {/* Category Management */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Categories</h2>
            <p className="text-sm text-gray-500">Manage product categories</p>
          </div>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500"
          >
            Add Category
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-700">{category.name}</span>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No categories found
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Add New Category
                </h2>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateCategory} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-4">
                        <button
                          onClick={() =>
                            handleStockUpdate(product.id, product.stock + 1)
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            handleStockUpdate(
                              product.id,
                              Math.max(0, product.stock - 1)
                            )
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) =>
                            handleStockUpdate(
                              product.id,
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500">
            Total Products
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {products.length}
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500">
            Low Stock Items
          </div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">
            {products.filter((p) => p.stock < 10 && p.stock > 0).length}
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Out of Stock</div>
          <div className="mt-2 text-3xl font-bold text-red-600">
            {products.filter((p) => p.stock === 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}
