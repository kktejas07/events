import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const role = (req.auth?.user as { role?: string })?.role;

  const adminRoles = [
    "ADMIN",
    "SUPER_ADMIN",
    "SCANNER",
    "ORGANIZATION_ADMIN",
    "ORGANIZATION_SCANNER",
  ];

  if (pathname.startsWith("/org-admin")) {
    if (!["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!["ADMIN", "SUPER_ADMIN", "SCANNER"].includes(role || "")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/scan")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!adminRoles.includes(role || "")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (
    pathname.startsWith("/my-tickets") ||
    pathname === "/profile" ||
    pathname.startsWith("/checkout")
  ) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/my-tickets") || pathname === "/profile") {
    if (
      ["ADMIN", "SUPER_ADMIN", "SCANNER", "ORGANIZATION_ADMIN", "ORGANIZATION_SCANNER"].includes(
        role || ""
      )
    ) {
      if (role === "SCANNER" || role === "ORGANIZATION_SCANNER") {
        return NextResponse.redirect(new URL("/scan", req.url));
      }
      if (role === "ORGANIZATION_ADMIN") {
        return NextResponse.redirect(new URL("/org-admin", req.url));
      }
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/org-admin/:path*",
    "/my-tickets/:path*",
    "/profile/:path*",
    "/checkout",
    "/scan",
  ],
};
