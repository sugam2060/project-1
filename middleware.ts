// middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { DEFAULT_USER_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes, adminOnlyRoutes } from "@/routes"

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  
  const isLoggedIn = !!session

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname)
  const isAdminOnlyRoutes = adminOnlyRoutes.includes(nextUrl.pathname)
  const isAdminPath = nextUrl.pathname.startsWith('/admin')

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isAuthRoutes) {
    if (isLoggedIn) {
      // Redirect to appropriate dashboard based on role
      if (session?.user?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', nextUrl))
      }
      return NextResponse.redirect(new URL(DEFAULT_USER_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  // Check for admin routes access
  if (isAdminPath || isAdminOnlyRoutes) {
    // If not logged in, redirect to login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login', nextUrl))
    }
    
    // If user role is not ADMIN, redirect to appropriate page
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(DEFAULT_USER_LOGIN_REDIRECT, nextUrl))
    }
  }

  if (!isLoggedIn && !isPublicRoutes) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl))
  }

  return NextResponse.next()
})

// Export the config to properly match routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}