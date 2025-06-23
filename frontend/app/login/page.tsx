'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // モック認証 - 実際はGoogle認証を実装
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // モック認証 - 実際はメール認証を実装
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

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

        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">ログイン</TabsTrigger>
            <TabsTrigger value="register">新規登録</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>ログイン</CardTitle>
                <CardDescription>
                  アカウントにログインして御朱印の記録を始めましょう
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Googleでログイン
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">または</span>
                  </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">パスワード</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="パスワードを入力"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    variant="outline"
                    size="lg"
                  >
                    メールでログイン
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>新規登録</CardTitle>
                <CardDescription>
                  新しいアカウントを作成して御朱印の世界を広げましょう
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Googleで登録
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">または</span>
                  </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">お名前</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="山田 太郎"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">パスワード</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="8文字以上のパスワード"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    variant="outline"
                    size="lg"
                  >
                    アカウントを作成
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-gray-600 mt-6">
          登録することで、
          <Link href="#" className="text-red-600 hover:underline">利用規約</Link>
          と
          <Link href="#" className="text-red-600 hover:underline">プライバシーポリシー</Link>
          に同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}