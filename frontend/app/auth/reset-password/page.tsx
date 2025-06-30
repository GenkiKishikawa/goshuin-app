"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

/**
 * パスワードリセットページのメインコンポーネント
 * 
 * useSearchParamsを使用するため、Suspenseでラップする必要がある。
 */
function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updatePassword, session } = useAuth()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  useEffect(() => {
    // パスワードリセットセッションの有効性をチェック
    const checkSession = () => {
      // URLにパスワードリセット用のトークンが含まれているかチェック
      const accessToken = searchParams.get('access_token')
      const type = searchParams.get('type')
      
      if (type === 'recovery' && accessToken && session) {
        setIsValidSession(true)
      } else {
        toast.error('無効なリセットリンクです')
        router.replace('/login')
      }
    }

    checkSession()
  }, [searchParams, session, router])

  /**
   * パスワード更新のバリデーション
   */
  const validatePasswords = (): boolean => {
    if (!password) {
      toast.error('新しいパスワードを入力してください')
      return false
    }

    if (password.length < 6) {
      toast.error('パスワードは6文字以上で入力してください')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません')
      return false
    }

    return true
  }

  /**
   * パスワード更新処理
   */
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswords()) {
      return
    }

    setIsLoading(true)

    try {
      await updatePassword(password)
      toast.success('パスワードを更新しました')
      router.replace('/dashboard')
    } catch (error) {
      console.error('パスワード更新エラー:', error)
      toast.error('パスワードの更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  // セッションが無効な場合は何も表示しない（リダイレクト処理中）
  if (!isValidSession) {
    return null
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
            <CardTitle>パスワードリセット</CardTitle>
            <CardDescription>
              新しいパスワードを設定してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">新しいパスワード</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="新しいパスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード確認</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="パスワードを再入力"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                {isLoading ? 'パスワード更新中...' : 'パスワードを更新'}
              </Button>
            </form>

            <div className="mt-6 text-center">
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
 * パスワードリセットページ
 * 
 * メールから送信されたリセットリンクを受け取り、
 * 新しいパスワードの設定を行うページ。
 * 
 * @returns パスワードリセットページのJSX要素
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}