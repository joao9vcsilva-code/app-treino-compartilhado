'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Challenge } from '@/lib/types';
import { Target, Users, Calendar, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengesListProps {
  challenges: Challenge[];
  userWorkouts: number;
}

export function ChallengesList({ challenges, userWorkouts }: ChallengesListProps) {
  const handleJoinChallenge = () => {
    toast.info('Funcionalidade de participar de desafios em breve!');
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Desafios Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const progress = Math.min(
                (userWorkouts / challenge.goal) * 100,
                100
              );
              const daysLeft = Math.ceil(
                (new Date(challenge.endDate).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <Card
                  key={challenge.id}
                  className="border-2 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {challenge.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {challenge.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="bg-purple-100 text-purple-700 border-purple-300"
                            >
                              <Users className="w-3 h-3 mr-1" />
                              {challenge.participants.length} participantes
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-700 border-blue-300"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              {daysLeft} dias restantes
                            </Badge>
                          </div>
                        </div>
                        <Trophy className="w-8 h-8 text-yellow-500" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-semibold text-gray-800">
                            {userWorkouts} / {challenge.goal}{' '}
                            {challenge.type === 'workouts'
                              ? 'treinos'
                              : challenge.type === 'minutes'
                              ? 'minutos'
                              : 'calorias'}
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-3"
                          indicatorClassName={
                            progress >= 100
                              ? 'bg-green-500'
                              : progress >= 50
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                          }
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {progress.toFixed(0)}% completo
                        </p>
                      </div>

                      {progress >= 100 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                          <p className="text-sm font-semibold text-green-700">
                            🎉 Desafio Concluído! Parabéns!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Button
              variant="outline"
              className="w-full border-dashed border-2 hover:bg-purple-50"
              onClick={handleJoinChallenge}
            >
              <Target className="w-4 h-4 mr-2" />
              Participar de Novos Desafios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
