import { createClient } from '@supabase/supabase-js'

/**
 * Supabase環境変数の取得
 * Next.jsの環境変数からSupabaseの接続情報を取得
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 必要な環境変数が設定されているかチェック
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required')
}

/**
 * SupabaseクライアントをPKCE flowで作成
 * 
 * PKCE (Proof Key for Code Exchange) flowを使用することで、
 * より安全な認証フローを実現。SPAやモバイルアプリに推奨される。
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // PKCE flowを有効化（デフォルトはfalse）
    flowType: 'pkce',
    // セッションの自動更新を有効化
    autoRefreshToken: true,
    // セッションをローカルストレージに永続化
    persistSession: true,
    // セッション検出の設定
    detectSessionInUrl: true,
  }
})