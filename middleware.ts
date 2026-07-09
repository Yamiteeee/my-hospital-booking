import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("hospital_user_session")?.value;
  const { pathname } = request.nextUrl;

  // Explicit target checks
  const isDoctorPath = pathname.startsWith("/doctor");
  const isReceptionistPath = pathname.startsWith("/receptionist");

  // Catch absolute unauthenticated access
  if ((isDoctorPath || isReceptionistPath) && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    
    // Aggressively strip cache policies on the response layer
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    return response;
  }

  return NextResponse.next();
}

// Ensure the middleware captures every single transition, including client data fetchers
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the entry page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};