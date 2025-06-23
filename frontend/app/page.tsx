import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Trophy, MapPin, Camera, Heart } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Camera,
      title: '御朱印を記録',
      description: '参拝した神社の御朱印を写真と共に記録。思い出を美しく保存できます。'
    },
    {
      icon: Users,
      title: '体験を共有',
      description: '他のユーザーと参拝体験を共有し、新しい発見や感動を分かち合えます。'
    },
    {
      icon: Trophy,
      title: 'ランキング',
      description: '訪問神社数や獲得御朱印数でランキング。モチベーション向上に。'
    },
    {
      icon: MapPin,
      title: '神社マップ',
      description: '全国の神社を地図で確認。次の参拝先を見つけるのに便利です。'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-red-700">わたしの御朱印</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-red-700 hover:text-red-800">
                  ログイン
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-red-600 hover:bg-red-700">
                  新規登録
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                見せる、集める、
                <br />
                <span className="text-red-600">つながる</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                SNS特化型オンライン御朱印帳で、あなたの神社参拝体験を記録・共有し、
                同じ趣味を持つ仲間とつながりましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                    無料で始める
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 text-lg px-8 py-3">
                  機能を見る
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/5273036/pexels-photo-5273036.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="御朱印帳"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-12 h-12 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              御朱印体験を豊かにする機能
            </h2>
            <p className="text-xl text-gray-600">
              参拝の記録から仲間との交流まで、すべてがここに
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-red-100 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="py-24 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              多くの方にご利用いただいています
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">1,200+</div>
              <p className="text-xl text-gray-700">登録ユーザー数</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">3,500+</div>
              <p className="text-xl text-gray-700">投稿された御朱印</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">800+</div>
              <p className="text-xl text-gray-700">登録神社数</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            今すぐ始めて、御朱印の世界を広げよう
          </h2>
          <p className="text-xl text-red-100 mb-8">
            無料登録で、すべての機能をご利用いただけます
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
              無料で始める
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">わたしの御朱印</span>
            </div>
            <p className="text-gray-400">
              © 2024 わたしの御朱印. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}