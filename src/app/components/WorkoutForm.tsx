'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutType, IntensityLevel, Workout } from '@/lib/types';
import { saveWorkout } from '@/lib/storage';
import { calculateCalories, getCalorieInfo } from '@/lib/calorieCalculator';
import { Dumbbell, Plus, Flame, Info } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutFormProps {
  onSuccess?: () => void;
}

export function WorkoutForm({ onSuccess }: WorkoutFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'cardio' as WorkoutType,
    name: '',
    duration: '',
    intensity: 'medium' as IntensityLevel,
    notes: '',
  });
  const [calculatedCalories, setCalculatedCalories] = useState<number>(0);
  const [calorieInfo, setCalorieInfo] = useState<string>('');

  // Calcular calorias automaticamente quando tipo, duração ou intensidade mudar
  useEffect(() => {
    if (formData.duration && parseInt(formData.duration) > 0) {
      const duration = parseInt(formData.duration);
      const calories = calculateCalories(formData.type, duration, formData.intensity);
      const info = getCalorieInfo(formData.type, duration, formData.intensity);
      
      setCalculatedCalories(calories);
      setCalorieInfo(info.description);
    } else {
      setCalculatedCalories(0);
      setCalorieInfo('');
    }
  }, [formData.type, formData.duration, formData.intensity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.duration) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const workout: Workout = {
      id: `workout_${Date.now()}`,
      userId: 'current_user',
      type: formData.type,
      name: formData.name,
      duration: parseInt(formData.duration),
      intensity: formData.intensity,
      calories: calculatedCalories,
      notes: formData.notes || undefined,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    saveWorkout(workout);
    toast.success(`Treino registrado! 🔥 ${calculatedCalories} calorias queimadas!`);
    
    // Reset form
    setFormData({
      type: 'cardio',
      name: '',
      duration: '',
      intensity: 'medium',
      notes: '',
    });
    setCalculatedCalories(0);
    setCalorieInfo('');
    
    setIsOpen(false);
    onSuccess?.();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Registrar Novo Treino
      </Button>
    );
  }

  return (
    <Card className="border-2 border-orange-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Dumbbell className="w-6 h-6 text-orange-600" />
          Novo Treino
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Exercício *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as WorkoutType })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Musculação</SelectItem>
                  <SelectItem value="flexibility">Flexibilidade</SelectItem>
                  <SelectItem value="sports">Esportes</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Treino *</Label>
              <Input
                id="name"
                placeholder="Ex: Corrida matinal"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="30"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensity">Intensidade</Label>
              <Select
                value={formData.intensity}
                onValueChange={(value) =>
                  setFormData({ ...formData, intensity: value as IntensityLevel })
                }
              >
                <SelectTrigger id="intensity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Leve</SelectItem>
                  <SelectItem value="medium">Moderada</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="extreme">Extrema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cálculo Automático de Calorias */}
          {calculatedCalories > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-gray-800">
                  Calorias Estimadas
                </span>
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                {calculatedCalories} kcal
              </div>
              {calorieInfo && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{calorieInfo}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                * Cálculo baseado em peso médio de 70kg. O valor real pode variar.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Como foi o treino? Alguma observação?"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
            >
              <Flame className="w-4 h-4 mr-2" />
              Salvar Treino
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
