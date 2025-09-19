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
}

export const useLessonStore = create<LessonState>()(
  persist(
    set => ({
      lesson: null,
      loading: false,
      error: null,

      setLesson: (lesson: ILesson) => {
        set({ lesson, error: null });
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
