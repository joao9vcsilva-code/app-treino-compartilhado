// Local Storage helpers for Workout Tracker

import { Workout, User, Friend, Challenge, Notification, UserSettings } from './types';

const STORAGE_KEYS = {
  USER: 'workout_tracker_user',
  WORKOUTS: 'workout_tracker_workouts',
  FRIENDS: 'workout_tracker_friends',
  CHALLENGES: 'workout_tracker_challenges',
  NOTIFICATIONS: 'workout_tracker_notifications',
  SETTINGS: 'workout_tracker_settings',
} as const;

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// User functions
export function getUser(): User | null {
  return getFromStorage<User | null>(STORAGE_KEYS.USER, null);
}

export function saveUser(user: User): void {
  saveToStorage(STORAGE_KEYS.USER, user);
}

export function createDefaultUser(): User {
  const user: User = {
    id: `user_${Date.now()}`,
    name: 'Atleta',
    totalWorkouts: 0,
    totalMinutes: 0,
    totalCalories: 0,
    joinedAt: new Date().toISOString(),
  };
  saveUser(user);
  return user;
}

// Workouts functions
export function getWorkouts(): Workout[] {
  return getFromStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
}

export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts();
  workouts.push(workout);
  saveToStorage(STORAGE_KEYS.WORKOUTS, workouts);
  
  // Update user stats
  const user = getUser();
  if (user) {
    user.totalWorkouts += 1;
    user.totalMinutes += workout.duration;
    user.totalCalories += workout.calories || 0;
    saveUser(user);
  }
}

export function deleteWorkout(id: string): void {
  const workouts = getWorkouts();
  const workout = workouts.find(w => w.id === id);
  const filtered = workouts.filter(w => w.id !== id);
  saveToStorage(STORAGE_KEYS.WORKOUTS, filtered);
  
  // Update user stats
  if (workout) {
    const user = getUser();
    if (user) {
      user.totalWorkouts = Math.max(0, user.totalWorkouts - 1);
      user.totalMinutes = Math.max(0, user.totalMinutes - workout.duration);
      user.totalCalories = Math.max(0, user.totalCalories - (workout.calories || 0));
      saveUser(user);
    }
  }
}

// Friends functions
export function getFriends(): Friend[] {
  return getFromStorage<Friend[]>(STORAGE_KEYS.FRIENDS, []);
}

export function saveFriend(friend: Friend): void {
  const friends = getFriends();
  friends.push(friend);
  saveToStorage(STORAGE_KEYS.FRIENDS, friends);
}

export function removeFriend(id: string): void {
  const friends = getFriends();
  const filtered = friends.filter(f => f.id !== id);
  saveToStorage(STORAGE_KEYS.FRIENDS, filtered);
}

// Challenges functions
export function getChallenges(): Challenge[] {
  return getFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, []);
}

export function saveChallenge(challenge: Challenge): void {
  const challenges = getChallenges();
  challenges.push(challenge);
  saveToStorage(STORAGE_KEYS.CHALLENGES, challenges);
}

export function updateChallenge(id: string, updates: Partial<Challenge>): void {
  const challenges = getChallenges();
  const index = challenges.findIndex(c => c.id === id);
  if (index !== -1) {
    challenges[index] = { ...challenges[index], ...updates };
    saveToStorage(STORAGE_KEYS.CHALLENGES, challenges);
  }
}

// Notifications functions
export function getNotifications(): Notification[] {
  return getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
}

export function addNotification(notification: Notification): void {
  const notifications = getNotifications();
  notifications.unshift(notification);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications.slice(0, 50)); // Keep last 50
}

export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

export function clearNotifications(): void {
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
}

// Settings functions
export function getSettings(): UserSettings {
  return getFromStorage<UserSettings>(STORAGE_KEYS.SETTINGS, {
    notifications: {
      enabled: true,
      frequency: 'daily',
    },
    goals: {
      weeklyWorkouts: 3,
      weeklyMinutes: 150,
    },
  });
}

export function saveSettings(settings: UserSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

// Initialize demo data
export function initializeDemoData(): void {
  const user = getUser();
  if (!user) {
    createDefaultUser();
  }
  
  const friends = getFriends();
  if (friends.length === 0) {
    const demoFriends: Friend[] = [
      {
        id: 'friend_1',
        name: 'João Silva',
        totalWorkouts: 45,
        totalMinutes: 1350,
        streak: 7,
      },
      {
        id: 'friend_2',
        name: 'Maria Santos',
        totalWorkouts: 38,
        totalMinutes: 1140,
        streak: 5,
      },
      {
        id: 'friend_3',
        name: 'Pedro Costa',
        totalWorkouts: 52,
        totalMinutes: 1560,
        streak: 12,
      },
    ];
    saveToStorage(STORAGE_KEYS.FRIENDS, demoFriends);
  }
  
  const challenges = getChallenges();
  if (challenges.length === 0) {
    const demoChallenges: Challenge[] = [
      {
        id: 'challenge_1',
        name: 'Desafio 30 Dias',
        description: 'Complete 20 treinos em 30 dias',
        goal: 20,
        current: 0,
        participants: ['user_demo', 'friend_1', 'friend_2'],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'workouts',
      },
      {
        id: 'challenge_2',
        name: 'Maratona de Minutos',
        description: 'Acumule 500 minutos de treino',
        goal: 500,
        current: 0,
        participants: ['user_demo', 'friend_3'],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'minutes',
      },
    ];
    saveToStorage(STORAGE_KEYS.CHALLENGES, demoChallenges);
  }
}
