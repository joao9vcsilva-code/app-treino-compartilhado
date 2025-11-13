'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Friend } from '@/lib/types';
import { Users, Trophy, Flame, TrendingUp, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface FriendsListProps {
  friends: Friend[];
  currentUserStats: {
    totalWorkouts: number;
    totalMinutes: number;
  };
}

export function FriendsList({ friends, currentUserStats }: FriendsListProps) {
  const handleAddFriend = () => {
    toast.info('Funcionalidade de adicionar amigos em breve!');
  };

  const sortedFriends = [...friends].sort(
    (a, b) => b.totalWorkouts - a.totalWorkouts
  );

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-600" />
              Seus Amigos
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddFriend}
              className="border-cyan-300 hover:bg-cyan-100"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Current User */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-orange-300 shadow-sm">
              <Avatar className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500">
                <AvatarFallback className="text-white font-bold">
                  EU
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">Você</p>
                  <Badge className="bg-orange-500 text-white">Seu perfil</Badge>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    {currentUserStats.totalWorkouts} treinos
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-red-500" />
                    {currentUserStats.totalMinutes} min
                  </span>
                </div>
              </div>
            </div>

            {/* Friends */}
            {sortedFriends.map((friend, index) => {
              const isAhead =
                friend.totalWorkouts > currentUserStats.totalWorkouts;

              return (
                <div
                  key={friend.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                >
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500">
                    <AvatarFallback className="text-white font-bold">
                      {friend.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">
                        {friend.name}
                      </p>
                      {index === 0 && (
                        <Badge className="bg-yellow-500 text-white">
                          🏆 Top 1
                        </Badge>
                      )}
                      {isAhead && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-blue-500" />
                        {friend.totalWorkouts} treinos
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        {friend.totalMinutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        🔥 {friend.streak} dias
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sua Posição no Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedFriends.map((friend, index) => {
              const userPosition =
                sortedFriends.filter(
                  (f) => f.totalWorkouts > currentUserStats.totalWorkouts
                ).length + 1;

              if (index + 1 === userPosition - 1 || index + 1 === userPosition) {
                return (
                  <div key={friend.id} className="text-sm">
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <span className="font-medium">
                        #{index + 1} {friend.name}
                      </span>
                      <span className="text-gray-600">
                        {friend.totalWorkouts} treinos
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <div className="flex items-center justify-between p-2 rounded bg-orange-100 border-2 border-orange-300">
              <span className="font-bold text-orange-800">
                #
                {sortedFriends.filter(
                  (f) => f.totalWorkouts > currentUserStats.totalWorkouts
                ).length + 1}{' '}
                Você
              </span>
              <span className="font-bold text-orange-800">
                {currentUserStats.totalWorkouts} treinos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
