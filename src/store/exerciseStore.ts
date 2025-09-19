import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExerciseState {
  currentStreak: number;
  currentIndex: number;
  currentTimer: number;
  currentTrials: number;
  incrementStreak: (streak: number) => void;
  increaseCurrentIndex: () => void;
  saveTimer: (timer: number) => void;
  decrementTrials: () => void;
  resetExercises: (trials?: number) => void;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, _get) => ({
      // Initial state
      currentStreak: 0,
      currentIndex: 0,
      currentTimer: 300, // Default timer value in seconds
      currentTrials: 3, // Default number of trials

      incrementStreak: (streak: number) => {
        set(state => {
          console.log(streak);
          console.log(state.currentStreak);
          return {
            currentStreak: state.currentStreak + streak,
          };
        });
      },

      increaseCurrentIndex: () => {
        set(state => ({
          currentIndex: state.currentIndex + 1,
        }));
      },

      saveTimer: (timer: number) => {
        set({ currentTimer: timer });
      },

      decrementTrials: () => {
        set(state => ({
          currentTrials: --state.currentTrials,
        }));
      },

      resetExercises: () => {
        set({
          currentIndex: 0,
          currentTimer: 300,
          currentTrials: 3,
        });
      },
    }),
    {
      name: 'exercise-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        currentStreak: state.currentStreak,
        currentIndex: state.currentIndex,
        currentTimer: state.currentTimer,
        currentTrials: state.currentTrials,
      }),
    },
  ),
);
