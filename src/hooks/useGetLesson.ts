import { ILesson } from '@/types';
import { useCallback, useEffect } from 'react';
import { useExerciseStore, useLessonStore } from '@/store';
import { lessonData } from '@/data/lessonData';

interface UseGetLessonResult {
  lesson: ILesson | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGetLesson = (): UseGetLessonResult => {
  const { lesson, loading, error, setLesson, setLoading, setError } =
    useLessonStore();
  const { currentIndex } = useExerciseStore();

  const fetchLesson = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate async operation with Promise.resolve
      // Add a small delay to mimic network request
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

      const data = await Promise.resolve(lessonData);
      setLesson(data as unknown as ILesson);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch lesson';
      setError(errorMessage);
      console.error('Error fetching lesson:', err);
    } finally {
      setLoading(false);
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
