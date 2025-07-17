'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Trophy, Upload, Calendar, Phone, Globe, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 神社登録フォームデータ
  const [shrineData, setShrineData] = useState({
    name: '',
    nameKana: '',
    prefecture: '',
    address: '',
    description: '',
    phone: '',
    websiteUrl: '',
    latitude: '',
    longitude: ''
  });

  // 御朱印登録フォームデータ
  const [goshuinData, setGoshuinData] = useState({
    shrineId: '',
    name: '',
    description: '',
    price: '',
    isLimited: false,
    availableFrom: '',
    availableTo: ''
  });

  // 都道府県リスト
  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const handleShrineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // バリデーション処理
    if (!shrineData.name || !shrineData.prefecture || !shrineData.address) {
      toast.error('必須項目を入力してください');
      setIsSubmitting(false);
      return;
    }

    // モック登録処理
    setTimeout(() => {
      toast.success('神社の登録申請を送信しました。管理者の承認をお待ちください。');
      setShrineData({
        name: '',
        nameKana: '',
        prefecture: '',
        address: '',
        description: '',
        phone: '',
        websiteUrl: '',
        latitude: '',
        longitude: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleGoshuinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // バリデーション処理
    if (!goshuinData.shrineId || !goshuinData.name) {
      toast.error('必須項目を入力してください');
      setIsSubmitting(false);
      return;
    }

    // モック登録処理
    setTimeout(() => {
      toast.success('御朱印の登録申請を送信しました。管理者の承認をお待ちください。');
      setGoshuinData({
        shrineId: '',
        name: '',
        description: '',
        price: '',
        isLimited: false,
        availableFrom: '',
        availableTo: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">新規登録申請</h1>
            <p className="text-lg text-gray-600">
              新しい神社や御朱印の情報を登録して、コミュニティに貢献しましょう
            </p>
          </div>

          <Tabs defaultValue="shrine" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shrine" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>神社を登録</span>
              </TabsTrigger>
              <TabsTrigger value="goshuin" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>御朱印を登録</span>
              </TabsTrigger>
            </TabsList>

            {/* 神社登録タブ */}
            <TabsContent value="shrine">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>神社の新規登録</span>
                  </CardTitle>
                  <CardDescription>
                    まだ登録されていない神社の情報を追加してください。管理者の承認後に公開されます。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShrineSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          神社名 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={shrineData.name}
                          onChange={(e) => setShrineData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="例: 湯島天神"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="nameKana" className="text-sm font-medium text-gray-700">
                          神社名（ひらがな）
                        </Label>
                        <Input
                          id="nameKana"
                          value={shrineData.nameKana}
                          onChange={(e) => setShrineData(prev => ({ ...prev, nameKana: e.target.value }))}
                          placeholder="例: ゆしまてんじん"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="prefecture" className="text-sm font-medium text-gray-700">
                          都道府県 <span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          value={shrineData.prefecture} 
                          onValueChange={(value) => setShrineData(prev => ({ ...prev, prefecture: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="都道府県を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {prefectures.map((prefecture) => (
                              <SelectItem key={prefecture} value={prefecture}>
                                {prefecture}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          電話番号
                        </Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={shrineData.phone}
                            onChange={(e) => setShrineData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="例: 03-1234-5678"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        住所 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        value={shrineData.address}
                        onChange={(e) => setShrineData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="例: 東京都文京区湯島3-30-1"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
                        ウェブサイトURL
                      </Label>
                      <div className="relative mt-1">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="websiteUrl"
                          type="url"
                          value={shrineData.websiteUrl}
                          onChange={(e) => setShrineData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                          placeholder="https://..."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                          緯度
                        </Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={shrineData.latitude}
                          onChange={(e) => setShrineData(prev => ({ ...prev, latitude: e.target.value }))}
                          placeholder="例: 35.708"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                          経度
                        </Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={shrineData.longitude}
                          onChange={(e) => setShrineData(prev => ({ ...prev, longitude: e.target.value }))}
                          placeholder="例: 139.768"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        説明・特色
                      </Label>
                      <Textarea
                        id="description"
                        value={shrineData.description}
                        onChange={(e) => setShrineData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="神社の歴史や特色、ご利益などを記載してください"
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? '申請中...' : '登録申請を送信'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 御朱印登録タブ */}
            <TabsContent value="goshuin">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span>御朱印の新規登録</span>
                  </CardTitle>
                  <CardDescription>
                    既存の神社の新しい御朱印情報を追加してください。管理者の承認後に公開されます。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGoshuinSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="shrineId" className="text-sm font-medium text-gray-700">
                        対象神社 <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={goshuinData.shrineId} 
                        onValueChange={(value) => setGoshuinData(prev => ({ ...prev, shrineId: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="神社を選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">明治神宮 - 東京都渋谷区</SelectItem>
                          <SelectItem value="2">伏見稲荷大社 - 京都府京都市</SelectItem>
                          <SelectItem value="3">浅草神社 - 東京都台東区</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="goshuinName" className="text-sm font-medium text-gray-700">
                        御朱印名 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="goshuinName"
                        value={goshuinData.name}
                        onChange={(e) => setGoshuinData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="例: 湯島天神 春限定御朱印"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="goshuinDescription" className="text-sm font-medium text-gray-700">
                        説明
                      </Label>
                      <Textarea
                        id="goshuinDescription"
                        value={goshuinData.description}
                        onChange={(e) => setGoshuinData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="御朱印の特徴や授与条件などを記載してください"
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                          御朱印料（円）
                        </Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="price"
                            type="number"
                            value={goshuinData.price}
                            onChange={(e) => setGoshuinData(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="300"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-6">
                        <Checkbox
                          id="isLimited"
                          checked={goshuinData.isLimited}
                          onCheckedChange={(checked) => 
                            setGoshuinData(prev => ({ ...prev, isLimited: !!checked }))
                          }
                        />
                        <Label htmlFor="isLimited" className="text-sm text-gray-700">
                          期間限定御朱印
                        </Label>
                      </div>
                    </div>

                    {goshuinData.isLimited && (
                      <div className="grid md:grid-cols-2 gap-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <Label htmlFor="availableFrom" className="text-sm font-medium text-gray-700">
                            頒布開始日
                          </Label>
                          <div className="relative mt-1">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="availableFrom"
                              type="date"
                              value={goshuinData.availableFrom}
                              onChange={(e) => setGoshuinData(prev => ({ ...prev, availableFrom: e.target.value }))}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="availableTo" className="text-sm font-medium text-gray-700">
                            頒布終了日
                          </Label>
                          <div className="relative mt-1">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="availableTo"
                              type="date"
                              value={goshuinData.availableTo}
                              onChange={(e) => setGoshuinData(prev => ({ ...prev, availableTo: e.target.value }))}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        {isSubmitting ? '申請中...' : '登録申請を送信'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}