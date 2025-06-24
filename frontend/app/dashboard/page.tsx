'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, TrendingUp, MapPin, Users, Trophy } from 'lucide-react';
import { mockPosts, mockUser, mockRankings } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardPage() {
  const [posts] = useState(mockPosts);
  
  const stats = [
    {
      title: '訪問神社数',
      value: mockUser.visitedShrines,
      icon: MapPin,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: '獲得御朱印数',
      value: mockUser.collectedGoshuin,
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: '投稿数',
      value: mockUser.posts,
      icon: PlusCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: '総いいね数',
      value: mockUser.totalLikes,
      icon: TrendingUp,
      color: 'text-red-600 bg-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ウェルカムカード */}
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl">おかえりなさい、{mockUser.name}さん</CardTitle>
                <CardDescription className="text-red-100">
                  今日はどちらの神社に参拝されますか？
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/post">
                  <Button className="bg-white text-red-600 hover:bg-gray-100">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    御朱印を投稿する
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* タイムライン */}
            <Tabs defaultValue="timeline" className="space-y-4">
              <TabsList>
                <TabsTrigger value="timeline">タイムライン</TabsTrigger>
                <TabsTrigger value="following">フォロー中</TabsTrigger>
                <TabsTrigger value="popular">人気の投稿</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              
              <TabsContent value="following" className="space-y-6">
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    フォロー中のユーザーがいません
                  </h3>
                  <p className="text-gray-500">
                    他のユーザーをフォローして、投稿を見てみましょう
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-6">
                {posts.slice().reverse().map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 統計カード */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">あなたの記録</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {stat.title}
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-bold">
                      {stat.value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ランキングプレビュー */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>今週のランキング</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">訪問神社数</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    2位
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">獲得御朱印数</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    1位
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">投稿いいね数</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    1位
                  </Badge>
                </div>
                <Link href="/rankings">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    全ランキングを見る
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* おすすめ神社 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>おすすめ神社</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">湯島天神</p>
                  <p className="text-gray-500">東京都文京区</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">亀戸天神社</p>
                  <p className="text-gray-500">東京都江東区</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">神田明神</p>
                  <p className="text-gray-500">東京都千代田区</p>
                </div>
                <Link href="/map">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    神社マップを見る
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}