"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Mail, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

/**
 * メール確認ページのメインコンポーネント
 * 
 * useSearchParamsを使用するため、Suspenseでラップする必要がある。
 */
function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, session, signOut } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // URLパラメータからメール確認の完了を検知
    const type = searchParams.get('type')
    const token = searchParams.get('token')
    
    if (type === 'email_change' || type === 'signup') {
      setIsVerified(true)
      toast.success('メールアドレスが確認されました')
    }
    
    // ユーザーが既にメール確認済みの場合はダッシュボードにリダイレクト
    if (user?.email_confirmed_at) {
      router.replace('/dashboard')
    }
  }, [searchParams, user, router])

  /**
   * メール確認リンクの再送処理
   */
  const handleResendConfirmation = async () => {
    if (!user?.email) {
      toast.error('メールアドレスが確認できません')
      return
    }

    setIsLoading(true)

    try {
      // Supabaseのresendメソッドを使用（モック実装）
      // 実際の実装では supabase.auth.resend() を使用
      toast.success('確認メールを再送しました')
    } catch (error) {
      console.error('メール再送エラー:', error)
      toast.error('メールの再送に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 別のメールアドレスでサインアップ
   */
  const handleSignUpWithDifferentEmail = async () => {
    try {
      await signOut()
      router.replace('/register')
    } catch (error) {
      console.error('サインアウトエラー:', error)
      toast.error('サインアウトに失敗しました')
    }
  }

  // メール確認完了の場合
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-red-700">わたしの御朱印</span>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-green-700">メール確認完了</CardTitle>
              <CardDescription>
                メールアドレスの確認が完了しました
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                ご登録ありがとうございます。<br />
                すべての機能をご利用いただけます。
              </p>

              <Button
                onClick={() => router.replace('/dashboard')}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                ダッシュボードへ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-red-700">わたしの御朱印</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle>メール確認</CardTitle>
            <CardDescription>
              登録を完了するためにメールを確認してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.email && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">送信先メールアドレス:</p>
                <p className="font-medium">{user.email}</p>
              </div>
            )}

            <p className="text-gray-600 text-sm">
              上記のメールアドレスに確認メールを送信しました。
              メール内のリンクをクリックして登録を完了してください。
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleResendConfirmation}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? '送信中...' : '確認メールを再送'}
              </Button>

              <Button
                onClick={handleSignUpWithDifferentEmail}
                variant="ghost"
                className="w-full"
              >
                別のメールアドレスで登録
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                メールが届かない場合は、迷惑メールフォルダもご確認ください
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-red-600 hover:underline"
              >
                ログインページに戻る
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * メール確認ページ
 * 
 * 新規登録後やメール確認リンクから遷移するページ。
 * メール確認の完了処理と再送機能を提供する。
 * 
 * @returns メール確認ページのJSX要素
 */
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}