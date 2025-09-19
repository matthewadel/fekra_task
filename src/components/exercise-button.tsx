import { useExerciseStore } from '@/store';
import { Button } from '@/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IExerciseButtonProps {
  disabled: boolean;
  is_answered: boolean;
  onPress?: () => void;
}
const ExerciseButton: React.FC<IExerciseButtonProps> = ({
  disabled,
  is_answered,
  onPress,
}) => {
  const { increaseCurrentIndex } = useExerciseStore();

  const handleSubmitButton = () => {
    onPress?.();
    if (is_answered) increaseCurrentIndex();
  };
  const { t } = useTranslation();

  return (
    <Button disabled={disabled} onPress={handleSubmitButton}>
      {is_answered ? t('exercise.continue') : t('exercise.check')}
    </Button>
  );
};

export { ExerciseButton };
