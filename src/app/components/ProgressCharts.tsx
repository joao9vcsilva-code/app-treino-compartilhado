'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workout } from '@/lib/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Activity, Flame, Clock } from 'lucide-react';

interface ProgressChartsProps {
  workouts: Workout[];
}

export function ProgressCharts({ workouts }: ProgressChartsProps) {
  const chartData = useMemo(() => {
    // Group workouts by date
    const grouped = workouts.reduce((acc, workout) => {
      const date = new Date(workout.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      
      if (!acc[date]) {
        acc[date] = {
          date,
          workouts: 0,
          minutes: 0,
          calories: 0,
        };
      }
      
      acc[date].workouts += 1;
      acc[date].minutes += workout.duration;
      acc[date].calories += workout.calories || 0;
      
      return acc;
    }, {} as Record<string, { date: string; workouts: number; minutes: number; calories: number }>);

    return Object.values(grouped).slice(-7); // Last 7 days
  }, [workouts]);

  const stats = useMemo(() => {
    const total = workouts.reduce(
      (acc, w) => ({
        workouts: acc.workouts + 1,
        minutes: acc.minutes + w.duration,
        calories: acc.calories + (w.calories || 0),
      }),
      { workouts: 0, minutes: 0, calories: 0 }
    );

    return total;
  }, [workouts]);

  if (workouts.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Sem dados para exibir
          </h3>
          <p className="text-sm text-gray-500">
            Registre treinos para ver seu progresso aqui!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Treinos</p>
                <p className="text-3xl font-bold text-blue-700">{stats.workouts}</p>
              </div>
              <Activity className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Minutos</p>
                <p className="text-3xl font-bold text-purple-700">{stats.minutes}</p>
              </div>
              <Clock className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Calorias</p>
                <p className="text-3xl font-bold text-orange-700">{stats.calories}</p>
              </div>
              <Flame className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Minutes Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Minutos por Dia (Últimos 7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Workouts & Calories Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Treinos e Calorias (Últimos 7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="workouts" fill="#3b82f6" name="Treinos" radius={[8, 8, 0, 0]} />
              <Bar dataKey="calories" fill="#f97316" name="Calorias" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
