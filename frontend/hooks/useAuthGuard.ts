import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAuth?: boolean
  requireEmailConfirmed?: boolean
  onUnauthorized?: () => void
}

/**
 * 認証ガードフック
 * 
 * コンポーネントで認証状態をチェックし、必要に応じてリダイレクトや
 * エラーハンドリングを行うカスタムフック。
 * 
 * @param options - 認証ガードのオプション設定
 * @returns 認証状態と制御フラグ
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    redirectTo = '/login',
    requireAuth = true,
    requireEmailConfirmed = false,
    onUnauthorized
  } = options

  const { user, session, isLoading, isInitialized, error } = useAuth()
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // 初期化が完了するまで待機
    if (!isInitialized) {
      return
    }

    setIsCheckingAuth(false)

    // 認証が必要でユーザーが認証されていない場合
    if (requireAuth && !user) {
      if (onUnauthorized) {
        onUnauthorized()
      } else {
        const currentPath = window.location.pathname
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
        router.replace(redirectUrl)
      }
      return
    }

    // メール確認が必要で確認されていない場合
    if (requireEmailConfirmed && user && !user.email_confirmed_at) {
      if (onUnauthorized) {
        onUnauthorized()
      } else {
        router.replace('/auth/verify-email')
      }
      return
    }

  }, [
    isInitialized,
    requireAuth,
    requireEmailConfirmed,
    user,
    router,
    redirectTo,
    onUnauthorized
  ])

  return {
    user,
    session,
    isLoading: isLoading || isCheckingAuth,
    isInitialized,
    error,
    isAuthenticated: !!user,
    isEmailConfirmed: !!user?.email_confirmed_at,
    canAccess: requireAuth ? !!user : true,
  }
}