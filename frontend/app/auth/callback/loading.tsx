import { Loader2 } from 'lucide-react'

/**
 * 認証コールバックページのローディングコンポーネント
 * 
 * コールバック処理中にNext.jsのSuspenseによって表示される。
 * ユーザーに処理中であることを視覚的に伝える。
 * 
 * @returns ローディング表示のJSX要素
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">認証処理中</h2>
        <p className="text-gray-600">
          ログイン情報を確認しています...
        </p>
      </div>
    </div>
  )
}