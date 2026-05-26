import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Get JWT/session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/auth/signin", "/auth/signup"];

  // If user is NOT logged in
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(publicRoutes[0], request.url));
  }

  // If user IS logged in and tries to visit login/signin
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Protect everything except:
      - next static files
      - images
      - favicon
      - next-auth api
      - public assets
    */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)).*)",
  ],
};