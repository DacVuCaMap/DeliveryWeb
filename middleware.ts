import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Lấy JWT token từ cookie
    const token = request.cookies.get('jwt')?.value

    // Đường dẫn hiện tại
    const pathname = request.nextUrl.pathname

    // Các route public không cần token
    const publicRoutes = ['/signin', '/signup',"/admin"]

    // Nếu là route public, cho phép truy cập không cần kiểm tra token
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next()
    }

    // // Nếu là route admin
    // if (pathname.startsWith('/admin')) {
    //     // Kiểm tra token
    //     if (!token) {
    //         // Nếu không có token, redirect về signin
    //         return NextResponse.redirect(new URL('/signin', request.url))
    //     }
    //     try {
    //         // Giả sử token hợp lệ, tiếp tục request
    //         return NextResponse.next()
    //     } catch (error) {
    //         // Nếu token không hợp lệ, redirect về signin
    //         return NextResponse.redirect(new URL('/signin', request.url))
    //     }
    // }

    // Đối với các route khác, tiếp tục request bình thường
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/admin/:path*',  // Bảo vệ tất cả route bắt đầu bằng /admin
        '/signin',        // Route signin
        '/signup'         // Route signup
    ],
}