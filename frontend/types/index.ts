export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  visitedShrines: number;
  collectedGoshuin: number;
  totalLikes: number;
  posts: number;
  registeredShrines: number;
  registeredGoshuin: number;
  joinedDate: string;
  following: number;
  followers: number;
}

export interface Shrine {
  id: string;
  name: string;
  location: string;
  address: string;
  prefecture: string;
  description?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  registeredBy?: string;
  registeredDate: string;
}

export interface Goshuin {
  id: string;
  shrineId: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  limitedTime?: boolean;
  registeredBy?: string;
  registeredDate: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  shrineId: string;
  shrine: Shrine;
  goshuinId: string;
  goshuin: Goshuin;
  images: string[];
  content: string;
  visitDate: string;
  createdDate: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdDate: string;
}

export interface Ranking {
  userId: string;
  user: User;
  rank: number;
  value: number;
  change: number; // ランキング変動
}