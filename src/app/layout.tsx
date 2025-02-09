import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swiggy Creation - Trendy Jewelry Collection",
  description:
    "Discover unique and trendy jewelry at Swiggy Creation. Express your style with our handcrafted pieces perfect for the modern fashion enthusiast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
