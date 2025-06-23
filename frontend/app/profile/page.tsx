'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Trophy, Heart, Camera, Users, Settings, Edit } from 'lucide-react';
import { mockUser, mockPosts } from '@/lib/mock-data';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function ProfilePage() {
  const [userPosts] = useState(mockPosts.filter(post => post.userId === mockUser.id));
  
  const achievements = [
    { title: '初回投稿', description: '最初の御朱印を投稿しました', earned: true },
    { title: '神社マスター', description: '10か所の神社を訪問しました', earned: true },
    { title: '御朱印コレクター', description: '50個の御朱印を獲得しました', earned: true },
    { title: '人気投稿者', description: '投稿が100いいねを獲得しました', earned: false },
    { title: '神社探検家', description: '100か所の神社を訪問しました', earned: false },
    { title: '情報提供者', description: '10か所の神社を新規登録しました', earned: false }
  ];

  const stats = [
    { label: '訪問神社数', value: mockUser.visitedShrines, icon: MapPin, color: 'text-blue-600' },
    { label: '獲得御朱印数', value: mockUser.collectedGoshuin, icon: Trophy, color: 'text-yellow-600' },
    { label: '投稿数', value: mockUser.posts, icon: Camera, color: 'text-green-600' },
    { label: '総いいね数', value: mockUser.totalLikes, icon: Heart, color: 'text-red-600' },
    { label: 'フォロワー', value: mockUser.followers, icon: Users, color: 'text-purple-600' },
    { label: 'フォロー中', value: mockUser.following, icon: Users, color: 'text-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* プロフィール情報 */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="bg-red-100 text-red-700 text-xl">
                    {mockUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
                <CardDescription className="text-base">
                  {mockUser.bio}
                </CardDescription>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mt-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {format(new Date(mockUser.joinedDate), 'yyyy年M月', { locale: ja })}に参加
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-3" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  プロフィールを編集
                </Button>
                <Button className="w-full" variant="ghost">
                  <Settings className="mr-2 h-4 w-4" />
                  設定
                </Button>
              </CardContent>
            </Card>

            {/* 統計 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">活動統計</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* バッジ・称号 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>バッジ・称号</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}>
                      <Trophy className={`w-4 h-4 ${achievement.earned ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${
                        achievement.earned ? 'text-yellow-800' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className={`text-xs ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="posts" className="space-y-4">
              <TabsList>
                <TabsTrigger value="posts">投稿</TabsTrigger>
                <TabsTrigger value="liked">いいね</TabsTrigger>
                <TabsTrigger value="visited">訪問神社</TabsTrigger>
                <TabsTrigger value="collection">御朱印帳</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        まだ投稿がありません
                      </h3>
                      <p className="text-gray-500 mb-4">
                        最初の御朱印を投稿してみましょう
                      </p>
                      <Button>
                        <Camera className="mr-2 h-4 w-4" />
                        投稿する
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="liked" className="space-y-6">
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      いいねした投稿がありません
                    </h3>
                    <p className="text-gray-500">
                      他の投稿にいいねをしてみましょう
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="visited" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">明治神宮</h3>
                      <p className="text-sm text-gray-500 mb-2">東京都渋谷区</p>
                      <Badge variant="secondary" className="text-xs">
                        2024年1月15日訪問
                      </Badge>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">浅草神社</h3>
                      <p className="text-sm text-gray-500 mb-2">東京都台東区</p>
                      <Badge variant="secondary" className="text-xs">
                        2024年1月10日訪問
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="collection" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">明治神宮 御朱印</h3>
                      <p className="text-sm text-gray-500">2024年1月15日獲得</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">浅草神社 御朱印</h3>
                      <p className="text-sm text-gray-500">2024年1月10日獲得</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}