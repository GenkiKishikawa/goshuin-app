import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // 保護されたルートのパス
        const protectedPaths = ["/post", "/profile/edit"]
        const pathname = req.nextUrl.pathname

        // 保護されたパスかチェック
        const isProtectedPath = protectedPaths.some(path => 
          pathname.startsWith(path)
        )

        // 保護されたパスの場合は認証が必要
        if (isProtectedPath) {
          return !!token
        }

        // その他のパスは認証なしでアクセス可能
        return true
      }
    },
    pages: {
      signIn: "/login",
    }
  }
)

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: [
    /*
     * 以下を除くすべてのリクエストパスにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}