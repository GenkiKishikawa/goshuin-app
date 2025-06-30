"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/useAuthState'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  requireEmailConfirmed?: boolean
}

/**
 * 認証が必要なルートを保護するコンポーネント
 * 
 * ユーザーが認証されていない場合は、ログインページにリダイレクトするか、
 * カスタムのフォールバックコンポーネントを表示する。
 * 
 * @param children - 認証されたユーザーに表示するコンテンツ
 * @param fallback - 認証されていない場合に表示するカスタムコンテンツ
 * @param redirectTo - 未認証時のリダイレクト先（デフォルト: /login）
 * @param requireEmailConfirmed - メール確認が必要かどうか
 * @returns 認証状態に応じたコンポーネント
 */
export function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/login',
  requireEmailConfirmed = false
}: ProtectedRouteProps) {
  const { user, session, isLoading, isInitialized, isAuthenticated, isEmailConfirmed } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    // 初期化が完了し、認証されていない場合はリダイレクト
    if (isInitialized && !isLoading && !isAuthenticated && !fallback) {
      const currentPath = window.location.pathname
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
      router.replace(redirectUrl)
    }
  }, [isInitialized, isLoading, isAuthenticated, router, redirectTo, fallback])

  // 初期化中またはロード中の場合
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">認証状態を確認しています...</p>
        </div>
      </div>
    )
  }

  // 認証されていない場合
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ログインが必要です
          </h2>
          <p className="text-gray-600 mb-6">
            この機能を利用するにはログインしてください
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href={redirectTo}>
                ログインする
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                ホームに戻る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // メール確認が必要な場合のチェック
  if (requireEmailConfirmed && !isEmailConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            メール確認が必要です
          </h2>
          <p className="text-gray-600 mb-6">
            登録時に送信されたメールから確認リンクをクリックしてください
          </p>
          <div className="space-y-3">
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                ダッシュボードに戻る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 認証されている場合は子コンポーネントを表示
  return <>{children}</>
}