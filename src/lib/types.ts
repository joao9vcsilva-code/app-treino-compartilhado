// Types for Workout Tracker App

export type WorkoutType = 
  | 'cardio' 
  | 'strength' 
  | 'flexibility' 
  | 'sports' 
  | 'other';

export type IntensityLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface Workout {
  id: string;
  userId: string;
  type: WorkoutType;
  name: string;
  duration: number; // in minutes
  intensity: IntensityLevel;
  calories?: number;
  notes?: string;
  date: string; // ISO string
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  joinedAt: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  totalWorkouts: number;
  totalMinutes: number;
  streak: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  goal: number;
  current: number;
  participants: string[];
  endDate: string;
  type: 'workouts' | 'minutes' | 'calories';
}

export interface Notification {
  id: string;
  type: 'reminder' | 'challenge' | 'achievement' | 'friend';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UserSettings {
  notifications: {
    enabled: boolean;
    reminderTime?: string;
    frequency: 'daily' | 'weekly' | 'custom';
  };
  goals: {
    weeklyWorkouts?: number;
    weeklyMinutes?: number;
    weeklyCalories?: number;
  };
}
