import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/verifyemail' ) || 
    path.startsWith('/forgotpassword') || path.startsWith('/tasks') || path.startsWith('/about_us')

    const token = request.cookies.get('token')?.value || ''

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))

    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/tasks', request.nextUrl))
    }
}
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/profiledata',
        '/about_us',
        '/tasks',
        '/verifyemail',
        '/forgotpassword',
        '/resetpassword/:path',

    ],
}