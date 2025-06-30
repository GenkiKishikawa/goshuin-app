import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

// Googleフォントのinterを設定（ラテン文字のサブセットを使用）
const inter = Inter({ subsets: ['latin'] });

/**
 * アプリケーションのメタデータ設定
 * Next.js 13+のApp Routerで使用されるSEO関連の情報
 */
export const metadata: Metadata = {
  title: 'わたしの御朱印 - SNS特化型オンライン御朱印帳',
  description: '見せる、集める、つながる。御朱印体験を記録・共有し、同じ趣味を持つ仲間とつながるSNSプラットフォーム',
};

/**
 * ルートレイアウトコンポーネント
 * 
 * アプリケーション全体をラップする最上位のレイアウト。
 * 認証プロバイダーとトースト通知を全ページで利用可能にする。
 * 
 * @param children - 各ページのコンテンツ
 * @returns アプリケーション全体のHTML構造
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja"> {/* 日本語設定 */}
      <body className={inter.className}> {/* Interフォントを適用 */}
        <AuthProvider> {/* 認証状態を全体で管理 */}
          {children} {/* 各ページのコンテンツ */}
          <Toaster /> {/* トースト通知システム */}
        </AuthProvider>
      </body>
    </html>
  );
}