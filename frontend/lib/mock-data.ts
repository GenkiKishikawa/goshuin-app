import { User, Shrine, Goshuin, Post, Ranking } from '@/types';

export const mockUser: User = {
  id: '1',
  name: '田中 花子',
  email: 'hanako@example.com',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  bio: '神社巡りが趣味です。特に関東地方の神社を中心に参拝しています。',
  visitedShrines: 47,
  collectedGoshuin: 52,
  totalLikes: 234,
  posts: 28,
  registeredShrines: 3,
  registeredGoshuin: 5,
  joinedDate: '2023-03-15',
  following: 23,
  followers: 15
};

export const mockShrines: Shrine[] = [
  {
    id: '1',
    name: '明治神宮',
    location: '東京都渋谷区',
    address: '東京都渋谷区代々木神園町1-1',
    prefecture: '東京都',
    description: '明治天皇と昭憲皇太后を祀る神社',
    image: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-161401.jpeg?auto=compress&cs=tinysrgb&w=400',
    registeredDate: '2023-01-01'
  },
  {
    id: '2',
    name: '伏見稲荷大社',
    location: '京都府京都市',
    address: '京都府京都市伏見区深草薮之内町68',
    prefecture: '京都府',
    description: '稲荷神を祀る神社の総本宮',
    image: 'https://images.pexels.com/photos/2413652/pexels-photo-2413652.jpeg?auto=compress&cs=tinysrgb&w=400',
    registeredDate: '2023-01-01'
  },
  {
    id: '3',
    name: '浅草神社',
    location: '東京都台東区',
    address: '東京都台東区浅草2-3-1',
    prefecture: '東京都',
    description: '三社祭で有名な神社',
    image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400',
    registeredDate: '2023-01-02'
  }
];

export const mockGoshuin: Goshuin[] = [
  {
    id: '1',
    shrineId: '1',
    name: '明治神宮 御朱印',
    description: '明治神宮の通常御朱印',
    image: 'https://images.pexels.com/photos/5273036/pexels-photo-5273036.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 300,
    registeredDate: '2023-01-01'
  },
  {
    id: '2',
    shrineId: '2',
    name: '伏見稲荷大社 御朱印',
    description: '伏見稲荷大社の通常御朱印',
    image: 'https://images.pexels.com/photos/5273037/pexels-photo-5273037.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 300,
    registeredDate: '2023-01-01'
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: mockUser,
    shrineId: '1',
    shrine: mockShrines[0],
    goshuinId: '1',
    goshuin: mockGoshuin[0],
    images: ['https://images.pexels.com/photos/5273036/pexels-photo-5273036.jpeg?auto=compress&cs=tinysrgb&w=500'],
    content: '久しぶりに明治神宮を参拝しました。平日だったので比較的静かで、心穏やかにお参りできました。御朱印も美しく書いていただき感謝です。',
    visitDate: '2024-01-15',
    createdDate: '2024-01-15T14:30:00Z',
    likes: 12,
    comments: [],
    isLiked: false
  },
  {
    id: '2',
    userId: '2',
    user: {
      id: '2',
      name: '佐藤 太郎',
      email: 'taro@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: '全国の神社を巡っています',
      visitedShrines: 23,
      collectedGoshuin: 28,
      totalLikes: 156,
      posts: 15,
      registeredShrines: 1,
      registeredGoshuin: 2,
      joinedDate: '2023-05-20',
      following: 12,
      followers: 8
    },
    shrineId: '2',
    shrine: mockShrines[1],
    goshuinId: '2',
    goshuin: mockGoshuin[1],
    images: ['https://images.pexels.com/photos/2413652/pexels-photo-2413652.jpeg?auto=compress&cs=tinysrgb&w=500'],
    content: '念願の伏見稲荷大社へ！千本鳥居は圧巻でした。山頂まで登って達成感もひとしお。御朱印も力強い筆致で素晴らしかったです。',
    visitDate: '2024-01-12',
    createdDate: '2024-01-12T10:15:00Z',
    likes: 25,
    comments: [
      {
        id: '1',
        userId: '1',
        user: mockUser,
        content: '素晴らしい写真ですね！私も行ってみたいです。',
        createdDate: '2024-01-12T11:00:00Z'
      }
    ],
    isLiked: true
  }
];

export const mockRankings: {
  visitedShrines: Ranking[];
  collectedGoshuin: Ranking[];
  totalLikes: Ranking[];
  registeredShrines: Ranking[];
  posts: Ranking[];
} = {
  visitedShrines: [
    { userId: '2', user: mockUser, rank: 1, value: 47, change: 0 },
    { userId: '1', user: mockUser, rank: 2, value: 42, change: 1 },
    { userId: '3', user: mockUser, rank: 3, value: 38, change: -1 }
  ],
  collectedGoshuin: [
    { userId: '1', user: mockUser, rank: 1, value: 52, change: 0 },
    { userId: '2', user: mockUser, rank: 2, value: 45, change: 0 },
    { userId: '3', user: mockUser, rank: 3, value: 41, change: 0 }
  ],
  totalLikes: [
    { userId: '1', user: mockUser, rank: 1, value: 234, change: 2 },
    { userId: '2', user: mockUser, rank: 2, value: 198, change: -1 },
    { userId: '3', user: mockUser, rank: 3, value: 156, change: -1 }
  ],
  registeredShrines: [
    { userId: '1', user: mockUser, rank: 1, value: 3, change: 0 },
    { userId: '2', user: mockUser, rank: 2, value: 2, change: 0 },
    { userId: '3', user: mockUser, rank: 3, value: 1, change: 0 }
  ],
  posts: [
    { userId: '1', user: mockUser, rank: 1, value: 28, change: 1 },
    { userId: '2', user: mockUser, rank: 2, value: 24, change: -1 },
    { userId: '3', user: mockUser, rank: 3, value: 19, change: 0 }
  ]
};