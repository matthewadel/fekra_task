import { ILesson } from '@/types';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { useExerciseStore, useLessonStore } from '@/store';

interface UseGetLessonResult {
  lesson: ILesson | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // For Android emulator, use 10.0.2.2 to access host machine's localhost
    // For physical Android device, you'd need to use your computer's IP address
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

export const useGetLesson = (): UseGetLessonResult => {
  const { lesson, loading, error, setLesson, setLoading, setError } =
    useLessonStore();
  const { currentIndex } = useExerciseStore();

  const fetchLesson = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/lesson`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLesson(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch lesson';
      setError(errorMessage);
      console.error('Error fetching lesson:', err);
    }
  }, [setLoading, setError, setLesson]);

  useEffect(() => {
    if (!currentIndex) fetchLesson();
  }, [fetchLesson, currentIndex]);

  const refetch = () => fetchLesson();

  return {
    lesson,
    loading,
    error,
    refetch,
  };
};
