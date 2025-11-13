'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Workout } from '@/lib/types';
import { Trash2, Calendar, Clock, Flame, Zap } from 'lucide-react';
import { deleteWorkout } from '@/lib/storage';
import { toast } from 'sonner';

interface WorkoutListProps {
  workouts: Workout[];
  onUpdate: () => void;
}

const intensityColors = {
  low: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  extreme: 'bg-red-100 text-red-800 border-red-300',
};

const intensityLabels = {
  low: 'Leve',
  medium: 'Moderada',
  high: 'Alta',
  extreme: 'Extrema',
};

const typeLabels = {
  cardio: 'Cardio',
  strength: 'Musculação',
  flexibility: 'Flexibilidade',
  sports: 'Esportes',
  other: 'Outro',
};

export function WorkoutList({ workouts, onUpdate }: WorkoutListProps) {
  const handleDelete = (id: string) => {
    deleteWorkout(id);
    toast.success('Treino removido');
    onUpdate();
  };

  if (workouts.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Zap className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum treino registrado
          </h3>
          <p className="text-sm text-gray-500">
            Comece registrando seu primeiro treino acima!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {workouts.map((workout) => (
        <Card
          key={workout.id}
          className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{workout.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[workout.type]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${intensityColors[workout.intensity]}`}
                  >
                    {intensityLabels[workout.intensity]}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(workout.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{workout.duration} min</span>
              </div>
              {workout.calories && workout.calories > 0 && (
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                    {workout.calories} kcal
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>
                  {new Date(workout.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              </div>
            </div>
            {workout.notes && (
              <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {workout.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
