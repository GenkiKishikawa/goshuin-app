'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, MessageCircle, MapPin, Calendar, Bookmark } from 'lucide-react';
import { Post } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 overflow-hidden border border-red-50 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* ユーザー情報 */}
      <div className="flex items-center space-x-3 p-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback className="bg-red-100 text-red-700">
            {post.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{post.user.name}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{post.shrine.name}</span>
            <span>•</span>
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(post.visitDate), 'yyyy年M月d日', { locale: ja })}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      {/* 画像 */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={post.images[0]}
          alt="御朱印"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* コンテンツ */}
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{post.goshuin.name}</h3>
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>
        
        {/* 神社情報 */}
        <div className="bg-red-50 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="font-medium text-red-800">{post.shrine.name}</span>
          </div>
          <p className="text-sm text-red-700">{post.shrine.location}</p>
          {post.goshuin.price && (
            <p className="text-sm text-red-600 mt-1">御朱印料：{post.goshuin.price}円</p>
          )}
        </div>
      </CardContent>

      {/* アクション */}
      <CardFooter className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-600' : 'text-gray-600'
              } hover:text-red-600`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            {format(new Date(post.createdDate), 'M月d日 HH:mm', { locale: ja })}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}