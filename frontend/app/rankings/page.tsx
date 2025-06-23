'use client';

import Header from '@/components/Header';
import RankingCard from '@/components/RankingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, MapPin, Camera, Heart, PlusCircle, Calendar } from 'lucide-react';
import { mockRankings } from '@/lib/mock-data';

export default function RankingsPage() {
  const rankingCategories = [
    {
      id: 'visitedShrines',
      title: '訪問神社数ランキング',
      description: '多くの神社を訪問したユーザーのランキング',
      icon: MapPin,
      unit: '社',
      color: 'text-blue-600 bg-blue-100',
      data: mockRankings.visitedShrines
    },
    {
      id: 'collectedGoshuin',
      title: '獲得御朱印数ランキング',
      description: '多くの御朱印を獲得したユーザーのランキング',
      icon: Trophy,
      unit: '個',
      color: 'text-yellow-600 bg-yellow-100',
      data: mockRankings.collectedGoshuin
    },
    {
      id: 'totalLikes',
      title: '投稿いいね数ランキング',
      description: '投稿が多くのいいねを獲得したユーザーのランキング',
      icon: Heart,
      unit: 'いいね',
      color: 'text-red-600 bg-red-100',
      data: mockRankings.totalLikes
    },
    {
      id: 'posts',
      title: '投稿数ランキング',
      description: '多くの投稿をしたユーザーのランキング',
      icon: Camera,
      unit: '投稿',
      color: 'text-green-600 bg-green-100',
      data: mockRankings.posts
    },
    {
      id: 'registeredShrines',
      title: '新規神社登録数ランキング',
      description: '新しい神社を多く登録したユーザーのランキング',
      icon: PlusCircle,
      unit: '社',
      color: 'text-purple-600 bg-purple-100',
      data: mockRankings.registeredShrines
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">ランキング</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            様々な指標でユーザーランキングを確認できます。目標を立てて御朱印集めを楽しみましょう！
          </p>
        </div>

        {/* 期間選択 */}
        <Tabs defaultValue="weekly" className="mb-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="weekly">週間</TabsTrigger>
              <TabsTrigger value="monthly">月間</TabsTrigger>
              <TabsTrigger value="yearly">年間</TabsTrigger>
              <TabsTrigger value="overall">総合</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="weekly" className="space-y-8 mt-8">
            {rankingCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <span>{category.title}</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>今週</span>
                    </div>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {category.data.map((ranking) => (
                      <RankingCard
                        key={ranking.userId}
                        ranking={ranking}
                        category={category.title}
                        unit={category.unit}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-8 mt-8">
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                月間ランキング
              </h3>
              <p className="text-gray-500">
                月間ランキングは現在準備中です
              </p>
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-8 mt-8">
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                年間ランキング
              </h3>
              <p className="text-gray-500">
                年間ランキングは現在準備中です
              </p>
            </div>
          </TabsContent>

          <TabsContent value="overall" className="space-y-8 mt-8">
            {rankingCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <span>{category.title}</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Trophy className="w-4 h-4" />
                      <span>総合</span>
                    </div>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {category.data.map((ranking) => (
                      <RankingCard
                        key={ranking.userId}
                        ranking={ranking}
                        category={category.title}
                        unit={category.unit}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}