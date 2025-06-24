'use client';

import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Filter, Navigation } from 'lucide-react';
import { mockShrines } from '@/lib/mock-data';
import { useState } from 'react';

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');

  const filteredShrines = mockShrines.filter(shrine => 
    (searchQuery === '' || shrine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     shrine.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedPrefecture === '' || shrine.prefecture === selectedPrefecture)
  );

  const prefectures = ['東京都', '京都府', '大阪府', '神奈川県', '千葉県', '埼玉県'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">神社マップ</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            全国の神社を地図で確認して、次の参拝先を見つけましょう
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* マップエリア */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      インタラクティブマップ
                    </h3>
                    <p className="text-gray-600 mb-4">
                      実際の実装では、ここにGoogle MapsやMapboxなどの地図が表示されます
                    </p>
                    <Button>
                      <Navigation className="mr-2 h-4 w-4" />
                      現在地から探す
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 検索・フィルター */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>神社を探す</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="神社名や地域で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedPrefecture}
                    onChange={(e) => setSelectedPrefecture(e.target.value)}
                  >
                    <option value="">都道府県を選択</option>
                    {prefectures.map(prefecture => (
                      <option key={prefecture} value={prefecture}>
                        {prefecture}
                      </option>
                    ))}
                  </select>
                </div>
                <Button className="w-full" variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  詳細フィルター
                </Button>
              </CardContent>
            </Card>

            {/* 神社リスト */}
            <Card>
              <CardHeader>
                <CardTitle>神社一覧</CardTitle>
                <CardDescription>
                  {filteredShrines.length}件の神社が見つかりました
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredShrines.map((shrine) => (
                    <div
                      key={shrine.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{shrine.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {shrine.prefecture}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{shrine.location}</p>
                      {shrine.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {shrine.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>詳細を見る</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs">
                          参拝記録
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 統計情報 */}
            <Card>
              <CardHeader>
                <CardTitle>登録統計</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">登録神社数</span>
                  <Badge variant="secondary">{mockShrines.length}社</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">都道府県数</span>
                  <Badge variant="secondary">
                    {new Set(mockShrines.map(s => s.prefecture)).size}県
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">今月の新規登録</span>
                  <Badge variant="secondary">12社</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}