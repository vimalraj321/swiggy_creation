import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Allow access to login and register pages
  if (
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname === "/admin/signup"
  ) {
    return NextResponse.next();
  }

  // Check if the request is for the admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await auth();

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Check if user has admin role
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/:path*",
};
