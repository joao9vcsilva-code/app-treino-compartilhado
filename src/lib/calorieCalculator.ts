// Calorie Calculator for Different Exercise Types
// Based on MET (Metabolic Equivalent of Task) values

import { WorkoutType, IntensityLevel } from './types';

// MET values for different exercises and intensities
// MET = Metabolic Equivalent of Task (1 MET = resting metabolic rate)
const MET_VALUES: Record<WorkoutType, Record<IntensityLevel, number>> = {
  cardio: {
    low: 3.5,      // Caminhada leve
    medium: 7.0,   // Corrida moderada
    high: 10.0,    // Corrida intensa
    extreme: 14.0, // Sprint/HIIT
  },
  strength: {
    low: 3.0,      // Alongamento com pesos leves
    medium: 5.0,   // Musculação moderada
    high: 6.0,     // Musculação intensa
    extreme: 8.0,  // CrossFit/Treino pesado
  },
  flexibility: {
    low: 2.5,      // Alongamento suave
    medium: 3.0,   // Yoga/Pilates
    high: 4.0,     // Yoga avançado
    extreme: 5.0,  // Ashtanga/Power Yoga
  },
  sports: {
    low: 4.0,      // Esporte recreativo
    medium: 6.0,   // Esporte moderado
    high: 8.0,     // Esporte competitivo
    extreme: 12.0, // Esporte de alta performance
  },
  other: {
    low: 3.0,      // Atividade leve
    medium: 5.0,   // Atividade moderada
    high: 7.0,     // Atividade intensa
    extreme: 10.0, // Atividade extrema
  },
};

// Average weight for calculation (can be customized per user)
const AVERAGE_WEIGHT_KG = 70;

/**
 * Calculate calories burned based on exercise type, duration, and intensity
 * Formula: Calories = MET × weight(kg) × duration(hours)
 * 
 * @param type - Type of workout
 * @param duration - Duration in minutes
 * @param intensity - Intensity level
 * @param weight - User weight in kg (optional, defaults to 70kg)
 * @returns Estimated calories burned
 */
export function calculateCalories(
  type: WorkoutType,
  duration: number,
  intensity: IntensityLevel,
  weight: number = AVERAGE_WEIGHT_KG
): number {
  const met = MET_VALUES[type][intensity];
  const durationInHours = duration / 60;
  const calories = met * weight * durationInHours;
  
  return Math.round(calories);
}

/**
 * Get detailed information about calorie burn for a specific exercise
 */
export function getCalorieInfo(
  type: WorkoutType,
  duration: number,
  intensity: IntensityLevel
): {
  calories: number;
  met: number;
  description: string;
} {
  const met = MET_VALUES[type][intensity];
  const calories = calculateCalories(type, duration, intensity);
  
  const descriptions: Record<WorkoutType, Record<IntensityLevel, string>> = {
    cardio: {
      low: 'Caminhada leve ou ciclismo suave',
      medium: 'Corrida moderada ou natação',
      high: 'Corrida intensa ou ciclismo rápido',
      extreme: 'Sprint, HIIT ou corrida em alta velocidade',
    },
    strength: {
      low: 'Alongamento com pesos leves',
      medium: 'Musculação com carga moderada',
      high: 'Musculação intensa com cargas pesadas',
      extreme: 'CrossFit ou treino funcional extremo',
    },
    flexibility: {
      low: 'Alongamento suave',
      medium: 'Yoga ou Pilates',
      high: 'Yoga avançado (Vinyasa)',
      extreme: 'Ashtanga ou Power Yoga',
    },
    sports: {
      low: 'Esporte recreativo leve',
      medium: 'Futebol, basquete ou tênis moderado',
      high: 'Esporte competitivo intenso',
      extreme: 'Esporte de alta performance',
    },
    other: {
      low: 'Atividade física leve',
      medium: 'Atividade física moderada',
      high: 'Atividade física intensa',
      extreme: 'Atividade física extrema',
    },
  };
  
  return {
    calories,
    met,
    description: descriptions[type][intensity],
  };
}

/**
 * Get calorie ranges for all intensities of a workout type
 */
export function getCalorieRanges(
  type: WorkoutType,
  duration: number
): Record<IntensityLevel, number> {
  return {
    low: calculateCalories(type, duration, 'low'),
    medium: calculateCalories(type, duration, 'medium'),
    high: calculateCalories(type, duration, 'high'),
    extreme: calculateCalories(type, duration, 'extreme'),
  };
}
