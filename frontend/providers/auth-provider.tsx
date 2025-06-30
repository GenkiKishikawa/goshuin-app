"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react"
import { User, Session, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { createAuthErrorDetails, AuthValidator } from "@/lib/auth-error-handler"

/**
 * 認証エラーのカスタム型定義
 */
export interface AuthErrorDetails {
  message: string
  code?: string
  details?: string
}

/**
 * 認証関連のアクション型定義
 */
export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void> // メール・パスワードでログイン
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void> // 新規ユーザー登録
  signOut: () => Promise<void> // ログアウト
  signInWithGoogle: (redirectTo?: string) => Promise<void> // Google認証でログイン
  resetPassword: (email: string) => Promise<void> // パスワードリセット
  updatePassword: (password: string) => Promise<void> // パスワード更新
  refreshSession: () => Promise<void> // セッション手動リフレッシュ
  clearError: () => void // エラークリア
}

/**
 * 認証状態の型定義
 */
export interface AuthState {
  user: User | null // 現在ログイン中のユーザー情報
  session: Session | null // Supabaseセッション情報
  isLoading: boolean // 認証状態の読み込み中フラグ
  isInitialized: boolean // 初期化完了フラグ
  error: AuthErrorDetails | null // 認証エラー情報
}

/**
 * 認証コンテキストの型定義
 * アプリケーション全体で使用される認証関連の状態と関数を定義
 */
export interface AuthContextType extends AuthState, AuthActions {}

// 認証コンテキストを作成（初期値はundefined）
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * 認証プロバイダーのProps型定義
 */
interface AuthProviderProps {
  children: ReactNode // 子コンポーネント
}

/**
 * 認証プロバイダーコンポーネント
 * 
 * アプリケーション全体で認証状態を管理し、
 * 子コンポーネントに認証関連の状態と関数を提供する。
 * 
 * @param children - ラップする子コンポーネント
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // 認証状態を管理するstate
  const [user, setUser] = useState<User | null>(null) // ユーザー情報
  const [session, setSession] = useState<Session | null>(null) // セッション情報
  const [isLoading, setIsLoading] = useState(true) // 初期読み込み状態
  const [isInitialized, setIsInitialized] = useState(false) // 初期化完了状態
  const [error, setError] = useState<AuthErrorDetails | null>(null) // 認証エラー情報

  /**
   * 認証エラーを処理して統一的なエラーメッセージを返す
   */
  const handleAuthError = useCallback((authError: AuthError): AuthErrorDetails => {
    return createAuthErrorDetails(authError)
  }, [])

  /**
   * セッション状態を更新する関数
   */
  const updateSessionState = useCallback((session: Session | null) => {
    setSession(session)
    setUser(session?.user ?? null)
    setIsLoading(false)
    if (!isInitialized) {
      setIsInitialized(true)
    }
  }, [isInitialized])

  useEffect(() => {
    let mounted = true

    /**
     * 現在のセッション情報を取得し、セッションの有効性をチェックする
     */
    const initializeSession = async () => {
      try {
        setIsLoading(true)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('セッション取得エラー:', error)
          const errorDetails = handleAuthError(error)
          setError(errorDetails)
        }
        
        if (mounted) {
          updateSessionState(session)
          
          // セッションが存在するが期限切れが近い場合はリフレッシュを試みる
          if (session && session.expires_at) {
            const expiresAt = new Date(session.expires_at * 1000)
            const now = new Date()
            const timeUntilExpiry = expiresAt.getTime() - now.getTime()
            
            // 5分以内に期限切れの場合はリフレッシュ
            if (timeUntilExpiry < 5 * 60 * 1000) {
              try {
                const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
                if (mounted && refreshedSession) {
                  updateSessionState(refreshedSession)
                }
              } catch (refreshError) {
                console.error('セッションリフレッシュエラー:', refreshError)
              }
            }
          }
        }
      } catch (error) {
        console.error('認証初期化エラー:', error)
        if (mounted) {
          setError({
            message: '認証システムの初期化に失敗しました',
            details: error instanceof Error ? error.message : '不明なエラー'
          })
          setIsLoading(false)
          setIsInitialized(true)
        }
      }
    }

    // コンポーネント初期化時にセッション情報を取得
    initializeSession()

    // 認証状態の変更を監視するリスナーを設定
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('認証イベント:', event, session?.user?.email)
        
        if (mounted) {
          // エラークリア
          setError(null)
          
          // セッション状態更新
          updateSessionState(session)
          
          // イベントに応じた処理
          switch (event) {
            case 'SIGNED_IN':
              toast.success('ログインしました')
              break
            case 'SIGNED_OUT':
              toast.success('ログアウトしました')
              break
            case 'TOKEN_REFRESHED':
              console.log('トークンがリフレッシュされました')
              break
            case 'USER_UPDATED':
              console.log('ユーザー情報が更新されました')
              break
            case 'PASSWORD_RECOVERY':
              toast.success('パスワードリセットメールを送信しました')
              break
          }
        }
      }
    )

    // クリーンアップ：コンポーネントのアンマウント時にリスナーを解除
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [handleAuthError, updateSessionState])

  /**
   * メールアドレスとパスワードでログインする関数
   * 
   * @param email - ユーザーのメールアドレス
   * @param password - ユーザーのパスワード
   * @throws エラーが発生した場合は例外をスロー
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // 入力値のバリデーション
      const validationError = AuthValidator.validateCredentials(email, password)
      if (validationError) {
        throw new Error(validationError)
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      
      if (error) {
        const errorDetails = handleAuthError(error)
        setError(errorDetails)
        throw new Error(errorDetails.message)
      }
      
      // ログイン成功時の処理は onAuthStateChange で自動的に行われる
    } catch (error) {
      console.error('ログインエラー:', error)
      setIsLoading(false)
      throw error
    }
  }, [handleAuthError])

  /**
   * 新規ユーザー登録を行う関数
   * 
   * @param email - 登録するメールアドレス
   * @param password - 設定するパスワード
   * @param metadata - ユーザーの追加メタデータ
   * @throws エラーが発生した場合は例外をスロー
   */
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // 入力値のバリデーション
      const validationError = AuthValidator.validateCredentials(email, password)
      if (validationError) {
        throw new Error(validationError)
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata || {},
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        const errorDetails = handleAuthError(error)
        setError(errorDetails)
        throw new Error(errorDetails.message)
      }
      
      // メール確認が必要な場合のメッセージ
      if (data.user && !data.session) {
        toast.success('登録完了！メールで確認リンクをクリックしてください')
      }
      
    } catch (error) {
      console.error('登録エラー:', error)
      setIsLoading(false)
      throw error
    }
  }, [handleAuthError])

  /**
   * ログアウト処理を行う関数
   * 
   * @throws エラーが発生した場合は例外をスロー
   */
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        const errorDetails = handleAuthError(error)
        setError(errorDetails)
        throw new Error(errorDetails.message)
      }
      
      // ログアウト成功時の処理は onAuthStateChange で自動的に行われる
    } catch (error) {
      console.error('ログアウトエラー:', error)
      setIsLoading(false)
      throw error
    }
  }, [handleAuthError])

  /**
   * Googleアカウントでログインする関数（PKCE flow対応）
   * 
   * @param redirectTo - ログイン成功後のリダイレクト先URL（オプション）
   * @throws エラーが発生した場合は例外をスロー
   */
  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // デフォルトは現在のページ、ただしログインページは除外
      const currentPath = window.location.pathname
      const redirectUrl = currentPath === '/login' ? '/dashboard' : currentPath
      const finalRedirect = redirectTo || redirectUrl

      // PKCE flowでGoogle認証を実行
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // PKCE flowでは認証後にコールバックページに一度リダイレクト
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(finalRedirect)}`,
          // セキュリティ向上のためqueryParamsを使用
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        const errorDetails = handleAuthError(error)
        setError(errorDetails)
        throw new Error(errorDetails.message)
      }
      
      // OAuthフローではリダイレクトが発生するため、ここは実行されない
    } catch (error) {
      console.error('Googleログインエラー:', error)
      setIsLoading(false)
      throw error
    }
  }, [handleAuthError])

  /**
   * パスワードリセットメールを送信する関数
   * 
   * @param email - リセット対象のメールアドレス
   * @throws エラーが発生した場合は例外をスロー
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null)
      
      if (!email) {
        throw new Error('メールアドレスを入力してください')
      }
      
      if (!AuthValidator.isValidEmail(email)) {
        throw new Error('有効なメールアドレスを入力してください')
      }
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) {
        const errorDetails = handleAuthError(error)
        setError(errorDetails)
        throw new Error(errorDetails.message)
      }
      
      toast.success('パスワードリセットメールを送信しました')
      
    } catch (error) {
      console.error('パスワードリセットエラー:', error)
      throw error
    }
  }, [handleAuthError])

  /**
   * パスワードを更新する関数
   * 
   * @param password - 新しいパスワード
   * @throws エラーが発生した場合は例外をスロー
   */
  const updatePassword = useCallback(async (password: string) => {
    try {
      setError(null)
      
      if (!password) {
        throw new Error('パスワードを入力してください')
      }
      
      if (!AuthValidator.isValidPassword(password)) {
        throw new Error('パスワードは6文字以上で入力してください')
      }
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      })
      
      if (error) {
        const errorDetails = handleAuthError(error)
        setError(errorDetails)
        throw new Error(errorDetails.message)
      }
      
      toast.success('パスワードを更新しました')
      
    } catch (error) {
      console.error('パスワード更新エラー:', error)
      throw error
    }
  }, [handleAuthError])

  /**
   * セッションを手動でリフレッシュする関数
   * 
   * @throws エラーが発生した場合は例外をスロー
   */
  const refreshSession = useCallback(async () => {
    try {
      setError(null)
      
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        const errorDetails = handleAuthError(error)
        setError(errorDetails)
        throw new Error(errorDetails.message)
      }
      
      if (data.session) {
        updateSessionState(data.session)
        console.log('セッションがリフレッシュされました')
      }
      
    } catch (error) {
      console.error('セッションリフレッシュエラー:', error)
      throw error
    }
  }, [handleAuthError, updateSessionState])

  /**
   * 認証エラーをクリアする関数
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // プロバイダーに渡す値をメモ化して不要な再レンダリングを防ぐ
  const authState: AuthState = {
    user,
    session,
    isLoading,
    isInitialized,
    error,
  }

  const authActions: AuthActions = {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    refreshSession,
    clearError,
  }

  const value = useMemo(
    () => ({ ...authState, ...authActions }),
    [authState, authActions]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * 認証コンテキストを使用するためのカスタムフック
 * 
 * AuthProvider内でのみ使用可能。
 * 認証状態と認証関連の関数にアクセスできる。
 * 
 * @returns 認証コンテキストの値
 * @throws AuthProvider外で使用された場合はエラーをスロー
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}