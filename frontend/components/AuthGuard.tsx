"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/hooks/useAuthState"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * 認証が必要なコンポーネントを保護するガード
 * 
 * ユーザーが認証されていない場合はログインページにリダイレクトします。
 * ProtectedRouteよりも軽量で、シンプルな保護機能のみ提供します。
 * 
 * @param children - 認証済みユーザーに表示するコンテンツ
 * @param fallback - 認証中に表示するコンテンツ
 * @param redirectTo - 未認証時のリダイレクト先
 */
export function AuthGuard({ children, fallback, redirectTo = '/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
  }, [isInitialized, isLoading, isAuthenticated, router, redirectTo])

  // 初期化中またはローディング中
  if (!isInitialized || isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  // 認証されていない場合は何も表示しない（リダイレクトを待つ）
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}