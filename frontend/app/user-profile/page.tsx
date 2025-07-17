'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Trophy, Heart, Camera, Users, UserPlus, UserMinus } from 'lucide-react';
import { mockUsers, mockPosts, mockFollows } from '@/lib/mock-data';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

function UserProfileContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id') || '1';
  
  // ユーザー情報を取得（実際はAPIから取得）
  const user = mockUsers.find(u => u.id === userId);
  const userPosts = mockPosts.filter(post => post.userId === userId);
  
  const [isFollowing, setIsFollowing] = useState(
    mockFollows.some(f => f.followerId === '1' && f.followingId === userId)
  );
  const [followerCount, setFollowerCount] = useState(user?.followers || 0);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ユーザーが見つかりません</h1>
            <p className="text-gray-600">指定されたユーザーは存在しないか、削除された可能性があります。</p>
          </div>
        </div>
      </div>
    );
  }

  const handleFollow = async () => {
    setIsLoading(true);
    
    // モックフォロー処理
    setTimeout(() => {
      if (isFollowing) {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        toast.success(`${user.name}さんのフォローを解除しました`);
      } else {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast.success(`${user.name}さんをフォローしました`);
      }
      setIsLoading(false);
    }, 1000);
  };

  const stats = [
    { label: '訪問神社数', value: user.visitedShrines, icon: MapPin, color: 'text-blue-600' },
    { label: '獲得御朱印数', value: user.collectedGoshuin, icon: Trophy, color: 'text-yellow-600' },
    { label: '投稿数', value: user.posts, icon: Camera, color: 'text-green-600' },
    { label: '総いいね数', value: user.totalLikes, icon: Heart, color: 'text-red-600' },
    { label: 'フォロワー', value: followerCount, icon: Users, color: 'text-purple-600' },
    { label: 'フォロー中', value: user.following, icon: Users, color: 'text-indigo-600' }
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-red-100 text-red-700 text-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-base">
                  {user.bio}
                </CardDescription>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mt-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {format(new Date(user.joinedDate), 'yyyy年M月', { locale: ja })}に参加
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {userId !== '1' && ( // 自分以外の場合はフォローボタンを表示
                  <Button 
                    className="w-full mb-3"
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      '処理中...'
                    ) : isFollowing ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        フォロー解除
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        フォローする
                      </>
                    )}
                  </Button>
                )}
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

            {/* バッジ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>獲得バッジ</span>
                </CardTitle>
                <CardDescription>
                  {user.badges.length}個のバッジを獲得
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.badges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="text-xl">
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-yellow-800">
                        {badge.name}
                      </p>
                      <p className="text-xs text-yellow-600">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
                {user.badges.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm">
                      全てのバッジを見る
                    </Button>
                  </div>
                )}
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
                      <p className="text-gray-500">
                        {user.name}さんの投稿をお待ちください
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="liked" className="space-y-6">
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      いいねした投稿
                    </h3>
                    <p className="text-gray-500">
                      この情報は非公開です
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="visited" className="space-y-6">
                <Card>
                  <CardContent className="text-center py-12">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      訪問神社一覧
                    </h3>
                    <p className="text-gray-500">
                      この情報は非公開です
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    }>
      <UserProfileContent />
    </Suspense>
  );
}