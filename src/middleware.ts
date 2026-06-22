import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const role = (req.auth?.user as { role?: string })?.role;

  if (pathname.startsWith("/admin")) {
    if (!["ADMIN", "SUPER_ADMIN", "SCANNER"].includes(role || "")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (
    pathname.startsWith("/my-tickets") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/checkout")
  ) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/my-tickets") || pathname.startsWith("/profile")) {
    if (["ADMIN", "SUPER_ADMIN", "SCANNER"].includes(role || "")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/my-tickets/:path*", "/profile/:path*", "/checkout"],
};
