"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

/**
 * OAuth認証コールバックページ（PKCE flow対応）
 * 
 * GoogleなどのOAuth認証後にリダイレクトされるページ。
 * PKCE flowでは認証コードを受け取り、セッションを確立した後、
 * 元のページまたは指定されたページにリダイレクトする。
 * 
 * @returns コールバック処理中の表示コンポーネント
 */
export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * 認証コールバック処理を行う非同期関数
     * PKCE flowでの認証コード交換とセッション確立を実行
     */
    const handleAuthCallback = async () => {
      try {
        // URLから認証コードとstate情報を取得してセッションを確立
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('認証エラー:', error)
          setError('認証に失敗しました。再度お試しください。')
          return
        }

        // セッションが正常に確立された場合
        if (data.session) {
          // リダイレクト先URLを取得（デフォルトはダッシュボード）
          const redirectTo = searchParams.get('redirect_to') || '/dashboard'
          
          // 元のページまたは指定されたページにリダイレクト
          router.replace(redirectTo)
        } else {
          // セッションが確立されなかった場合はログインページに戻る
          router.replace('/login?error=callback_failed')
        }
      } catch (err) {
        console.error('コールバック処理エラー:', err)
        setError('認証処理中にエラーが発生しました。')
      } finally {
        setIsLoading(false)
      }
    }

    // 認証コールバック処理を実行
    handleAuthCallback()
  }, [router, searchParams])

  // エラー状態の表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">認証エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.replace('/login')}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            ログインページに戻る
          </button>
        </div>
      </div>
    )
  }

  // ローディング状態の表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">認証処理中</h2>
        <p className="text-gray-600">
          {isLoading ? 'ログイン情報を確認しています...' : '完了しました。リダイレクトしています...'}
        </p>
      </div>
    </div>
  )
}