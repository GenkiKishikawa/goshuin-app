"use client"

import { ReactNode } from 'react'
import { useAuthLoading } from '@/hooks/useAuthState'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  showLoading?: boolean
  showError?: boolean
}

/**
 * 認証状態に応じてコンテンツを表示するラッパーコンポーネント
 * 
 * 認証の初期化処理中やエラー状態に対応した表示を提供する。
 * ProtectedRouteよりも軽量で、単純な認証状態の表示制御に使用。
 * 
 * @param children - 認証完了後に表示するコンテンツ
 * @param fallback - 認証未完了時に表示するコンテンツ
 * @param showLoading - ローディング表示を行うかどうか
 * @param showError - エラー表示を行うかどうか
 * @returns 認証状態に応じたコンポーネント
 */
export function AuthWrapper({
  children,
  fallback,
  showLoading = true,
  showError = true
}: AuthWrapperProps) {
  const { isLoading, isInitialized, error, isReady } = useAuthLoading()

  // エラー状態の表示
  if (error && showError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">認証エラー</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
            variant="destructive"
          >
            再読み込み
          </Button>
        </div>
      </div>
    )
  }

  // 初期化中またはロード中の場合
  if (!isReady && showLoading) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 初期化完了後は子コンポーネントを表示
  return <>{children}</>
}