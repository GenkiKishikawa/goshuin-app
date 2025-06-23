import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Ranking } from '@/types';

interface RankingCardProps {
  ranking: Ranking;
  category: string;
  unit: string;
}

export default function RankingCard({ ranking, category, unit }: RankingCardProps) {
  const getTrendIcon = () => {
    if (ranking.change > 0) {
      return <TrendingUp className="w-3 h-3 text-green-600" />;
    } else if (ranking.change < 0) {
      return <TrendingDown className="w-3 h-3 text-red-600" />;
    } else {
      return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getRankBadgeColor = () => {
    switch (ranking.rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className={`${getRankBadgeColor()} px-2 py-1 font-bold`}>
              {ranking.rank}位
            </Badge>
            <Avatar className="h-10 w-10">
              <AvatarImage src={ranking.user.avatar} alt={ranking.user.name} />
              <AvatarFallback className="bg-red-100 text-red-700">
                {ranking.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{ranking.user.name}</p>
              <p className="text-sm text-gray-500">
                {ranking.value}{unit}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            {ranking.change !== 0 && (
              <span className={`text-xs font-medium ${
                ranking.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(ranking.change)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}