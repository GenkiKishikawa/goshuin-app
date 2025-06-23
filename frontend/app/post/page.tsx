'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Calendar, Upload, X } from 'lucide-react';
import { mockShrines, mockGoshuin } from '@/lib/mock-data';

export default function PostPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shrine: '',
    goshuin: '',
    content: '',
    visitDate: '',
    newShrine: '',
    newShrineLocation: '',
    newGoshuin: '',
    newGoshuinPrice: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 実際の実装では画像をアップロードしますが、ここではモック画像を使用
      const mockImages = [
        'https://images.pexels.com/photos/5273036/pexels-photo-5273036.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/5273037/pexels-photo-5273037.jpeg?auto=compress&cs=tinysrgb&w=500'
      ];
      setImages(prev => [...prev, ...mockImages.slice(0, files.length)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // モック投稿処理
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">新しい投稿を作成</h1>
          <p className="text-lg text-gray-600">
            あなたの御朱印体験を記録・共有しましょう
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 画像アップロード */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>御朱印の写真</span>
              </CardTitle>
              <CardDescription>
                御朱印や神社の写真をアップロードしてください（最大5枚まで）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`アップロード画像 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      写真をアップロード
                    </p>
                    <p className="text-sm text-gray-500">
                      クリックして画像を選択してください
                    </p>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 神社選択 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>参拝した神社</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shrine">神社を選択</Label>
                <Select value={formData.shrine} onValueChange={(value) => setFormData(prev => ({ ...prev, shrine: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="神社を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockShrines.map((shrine) => (
                      <SelectItem key={shrine.id} value={shrine.id}>
                        {shrine.name} - {shrine.location}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">新しい神社を登録</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.shrine === 'new' && (
                <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                  <div>
                    <Label htmlFor="newShrine">新しい神社名</Label>
                    <Input
                      id="newShrine"
                      value={formData.newShrine}
                      onChange={(e) => setFormData(prev => ({ ...prev, newShrine: e.target.value }))}
                      placeholder="例: 湯島天神"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newShrineLocation">所在地</Label>
                    <Input
                      id="newShrineLocation"
                      value={formData.newShrineLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, newShrineLocation: e.target.value }))}
                      placeholder="例: 東京都文京区湯島3-30-1"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 御朱印選択 */}
          <Card>
            <CardHeader>
              <CardTitle>御朱印情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goshuin">御朱印を選択</Label>
                <Select value={formData.goshuin} onValueChange={(value) => setFormData(prev => ({ ...prev, goshuin: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="御朱印を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGoshuin.map((goshuin) => (
                      <SelectItem key={goshuin.id} value={goshuin.id}>
                        {goshuin.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">新しい御朱印を登録</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.goshuin === 'new' && (
                <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                  <div>
                    <Label htmlFor="newGoshuin">新しい御朱印名</Label>
                    <Input
                      id="newGoshuin"
                      value={formData.newGoshuin}
                      onChange={(e) => setFormData(prev => ({ ...prev, newGoshuin: e.target.value }))}
                      placeholder="例: 湯島天神 御朱印"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newGoshuinPrice">御朱印料（円）</Label>
                    <Input
                      id="newGoshuinPrice"
                      type="number"
                      value={formData.newGoshuinPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, newGoshuinPrice: e.target.value }))}
                      placeholder="300"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 参拝日と内容 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>参拝の記録</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="visitDate">参拝日</Label>
                <Input
                  type="date"
                  id="visitDate"
                  value={formData.visitDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">参拝の感想・コメント</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="参拝の感想や御朱印について感じたことを書いてください..."
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* 投稿ボタン */}
          <div className="flex justify-center space-x-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting || images.length === 0}
            >
              {isSubmitting ? '投稿中...' : '投稿する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}