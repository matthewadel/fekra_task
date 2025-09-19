import { IExercises } from './iexercise';

export interface ILesson {
  id: string;
  streak_increment: number;
  title: string;
  xp_per_correct: number;
  exercises: IExercises[];
}
