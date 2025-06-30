"use client"

import { useAuth } from "@/providers/auth-provider"
import { AuthUtils } from "@/lib/auth-utils"
import { useMemo } from "react"

/**
 * 認証状態と便利な派生状態を提供するカスタムフック
 * 
 * 認証プロバイダーから基本的な認証状態を取得し、
 * よく使用される派生状態を計算して返す。
 * 
 * @returns 認証状態と派生状態
 */
export function useAuthState() {
  const auth = useAuth()

  // 派生状態をメモ化して不要な再計算を防ぐ
  const derivedState = useMemo(() => ({
    // 基本状態
    isAuthenticated: !!auth.user && !!auth.session,
    isGuest: !auth.user,
    
    // セッション関連
    isSessionValid: AuthUtils.isSessionValid(auth.session),
    shouldRefreshSession: AuthUtils.shouldRefreshSession(auth.session),
    timeUntilExpiry: AuthUtils.getTimeUntilExpiry(auth.session),
    
    // ユーザー情報
    userRole: AuthUtils.getUserRole(auth.user),
    displayName: AuthUtils.getDisplayName(auth.user),
    avatarUrl: AuthUtils.getAvatarUrl(auth.user),
    authProvider: AuthUtils.getAuthProvider(auth.user),
    isEmailConfirmed: AuthUtils.isEmailConfirmed(auth.user),
    
    // 権限チェック用のヘルパー関数
    hasRole: (requiredRole: Parameters<typeof AuthUtils.hasRole>[1]) => 
      AuthUtils.hasRole(auth.user, requiredRole),
  }), [auth.user, auth.session])

  return {
    ...auth,
    ...derivedState,
  }
}

/**
 * 認証アクションのみを提供するカスタムフック
 * 
 * 認証状態の変更を監視する必要がないコンポーネントで使用し、
 * 不要な再レンダリングを防ぐ。
 * 
 * @returns 認証アクション関数のみ
 */
export function useAuthActions() {
  const { 
    signIn, 
    signUp, 
    signOut, 
    signInWithGoogle,
    resetPassword, 
    updatePassword, 
    refreshSession, 
    clearError 
  } = useAuth()

  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    refreshSession,
    clearError,
  }
}

/**
 * ローディング状態のみを提供するカスタムフック
 * 
 * ローディング表示のためだけに認証状態を監視したい場合に使用。
 * 
 * @returns ローディング関連の状態のみ
 */
export function useAuthLoading() {
  const { isLoading, isInitialized, error } = useAuth()

  return {
    isLoading,
    isInitialized,
    error,
    isReady: isInitialized && !isLoading,
  }
}