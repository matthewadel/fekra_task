import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILesson } from '@/types';

export interface LessonState {
  lesson: ILesson | null;
  loading: boolean;
  error: string | null;
  setLesson: (lesson: ILesson) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearLesson: () => void;
  saveUserAnswer: (exerciseId: string, userAnswer: string | string[]) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    set => ({
      lesson: null,
      loading: false,
      error: null,

      setLesson: (lesson: ILesson) => {
        set(state => {
          // If there's a previous lesson with user answers, preserve them
          if (state.lesson && state.lesson.exercises && lesson.exercises) {
            const updatedExercises = lesson.exercises.map(newExercise => {
              // Find corresponding exercise in previous lesson
              const previousExercise = state.lesson!.exercises.find(
                prevEx => prevEx.id === newExercise.id,
              );

              // If previous exercise exists and has a userAnswer, preserve it
              if (
                previousExercise &&
                previousExercise.userAnswer !== undefined
              ) {
                return {
                  ...newExercise,
                  userAnswer: previousExercise.userAnswer,
                };
              }

              return newExercise;
            });

            return {
              lesson: { ...lesson, exercises: updatedExercises },
              error: null,
            };
          }

          // No previous lesson or exercises, just set the new lesson
          return { lesson, error: null };
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error, loading: false });
      },

      clearLesson: () => {
        set({ lesson: null, error: null, loading: false });
      },

      saveUserAnswer: (exerciseId: string, userAnswer: string | string[]) => {
        set(state => {
          if (!state.lesson || !state.lesson.exercises) return state;

          const updatedExercises = state.lesson.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              return { ...exercise, userAnswer };
            }
            return exercise;
          });

          return {
            ...state,
            lesson: {
              ...state.lesson,
              exercises: updatedExercises,
            },
          };
        });
      },
    }),
    {
      name: 'lesson-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        lesson: state.lesson,
      }),
    },
  ),
);
