"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

/**
 * 認証コンテキストの型定義
 * アプリケーション全体で使用される認証関連の状態と関数を定義
 */
interface AuthContextType {
  user: User | null // 現在ログイン中のユーザー情報
  session: Session | null // Supabaseセッション情報
  isLoading: boolean // 認証状態の読み込み中フラグ
  signIn: (email: string, password: string) => Promise<void> // メール・パスワードでログイン
  signUp: (email: string, password: string) => Promise<void> // 新規ユーザー登録
  signOut: () => Promise<void> // ログアウト
  signInWithGoogle: () => Promise<void> // Google認証でログイン
}

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

  useEffect(() => {
    /**
     * 現在のセッション情報を取得する非同期関数
     */
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    // コンポーネント初期化時にセッション情報を取得
    getSession()

    // 認証状態の変更を監視するリスナーを設定
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    // クリーンアップ：コンポーネントのアンマウント時にリスナーを解除
    return () => subscription.unsubscribe()
  }, [])

  /**
   * メールアドレスとパスワードでログインする関数
   * 
   * @param email - ユーザーのメールアドレス
   * @param password - ユーザーのパスワード
   * @throws エラーが発生した場合は例外をスロー
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  /**
   * 新規ユーザー登録を行う関数
   * 
   * @param email - 登録するメールアドレス
   * @param password - 設定するパスワード
   * @throws エラーが発生した場合は例外をスロー
   */
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  /**
   * ログアウト処理を行う関数
   * 
   * @throws エラーが発生した場合は例外をスロー
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Googleアカウントでログインする関数
   * 
   * @param redirectTo - ログイン成功後のリダイレクト先URL（オプション）
   * @throws エラーが発生した場合は例外をスロー
   */
  const signInWithGoogle = async (redirectTo?: string) => {
    // デフォルトは現在のページ、ただしログインページは除外
    const currentPath = window.location.pathname
    const redirectUrl = currentPath === '/login' ? '/dashboard' : currentPath
    const finalRedirect = redirectTo || redirectUrl

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: finalRedirect // 認証成功後のリダイレクト先
      }
    })
    if (error) throw error
  }

  // プロバイダーに渡す値をオブジェクトとして定義
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }

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