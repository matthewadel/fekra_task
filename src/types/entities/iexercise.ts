export interface IExercises {
  answer: string;
  choices: string[];
  bank: string[];
  explanation: string;
  id: string;
  prompt_en: string;
  type: string;
  tolerance: Record<string, boolean>;
  pairs: { left: string; right: string }[];
}
