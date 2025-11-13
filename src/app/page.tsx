'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getWorkouts,
  getUser,
  getFriends,
  getChallenges,
  initializeDemoData,
} from '@/lib/storage';
import { Workout, User, Friend, Challenge } from '@/lib/types';
import { WorkoutForm } from './components/WorkoutForm';
import { WorkoutList } from './components/WorkoutList';
import { ProgressCharts } from './components/ProgressCharts';
import { FriendsList } from './components/FriendsList';
import { ChallengesList } from './components/ChallengesList';
import {
  Dumbbell,
  TrendingUp,
  Users,
  Target,
  Bell,
  Settings,
  Flame,
  Zap,
  Activity,
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData();
    loadData();
  }, []);

  const loadData = () => {
    setWorkouts(getWorkouts());
    setUser(getUser());
    setFriends(getFriends());
    setChallenges(getChallenges());
  };

  const handleWorkoutUpdate = () => {
    loadData();
  };

  const recentWorkouts = workouts.slice(-5).reverse();
  const totalStats = {
    workouts: user?.totalWorkouts || 0,
    minutes: user?.totalMinutes || 0,
    calories: user?.totalCalories || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Toaster position="top-center" richColors />
      
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  FitPulse
                </h1>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Sinta o pulso do fitness
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-full hover:bg-emerald-50 text-gray-600 hover:text-emerald-600"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-emerald-500 text-white text-xs border-2 border-white">
                  3
                </Badge>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-emerald-50 text-gray-600 hover:text-emerald-600"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl shadow-lg border border-gray-200 h-auto">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-600 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 data-[state=active]:shadow-md"
            >
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex items-center gap-2 data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-600 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 data-[state=active]:shadow-md"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-gray-600 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 data-[state=active]:shadow-md"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Amigos</span>
            </TabsTrigger>
            <TabsTrigger
              value="challenges"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-600 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 data-[state=active]:shadow-md"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Desafios</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Total de Treinos</p>
                      <p className="text-4xl font-bold text-gray-800">{totalStats.workouts}</p>
                      <p className="text-xs text-gray-500 mt-2">sessões completas</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <Dumbbell className="w-7 h-7 text-emerald-600" strokeWidth={2} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Total de Minutos</p>
                      <p className="text-4xl font-bold text-gray-800">{totalStats.minutes}</p>
                      <p className="text-xs text-gray-500 mt-2">minutos ativos</p>
                    </div>
                    <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-teal-600" strokeWidth={2} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Total de Calorias</p>
                      <p className="text-4xl font-bold text-gray-800">{totalStats.calories}</p>
                      <p className="text-xs text-gray-500 mt-2">kcal queimadas</p>
                    </div>
                    <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Flame className="w-7 h-7 text-orange-600" strokeWidth={2} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workout Form */}
            <WorkoutForm onSuccess={handleWorkoutUpdate} />

            {/* Recent Workouts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                Treinos Recentes
              </h2>
              <WorkoutList workouts={recentWorkouts} onUpdate={handleWorkoutUpdate} />
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Seu Progresso
              </h2>
              <ProgressCharts workouts={workouts} />
            </div>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Compare com Amigos
              </h2>
              <FriendsList
                friends={friends}
                currentUserStats={{
                  totalWorkouts: totalStats.workouts,
                  totalMinutes: totalStats.minutes,
                }}
              />
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Desafios e Metas
              </h2>
              <ChallengesList
                challenges={challenges}
                userWorkouts={totalStats.workouts}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/80 backdrop-blur-xl border-t border-emerald-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <p className="text-lg font-bold text-gray-800">
              FitPulse
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Monitore seus treinos e evolua com seus amigos 💪✨
          </p>
        </div>
      </footer>
    </div>
  );
}
