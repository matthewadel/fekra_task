import React, { useState } from 'react';
import { Text, View, Colors, TouchableOpacity } from '@/ui';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { IExercises } from '@/types';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useExerciseStore, useLessonStore } from '@/store';
import { ExerciseButton } from './exercise-button';

const MultipleChoice: React.FC<{
  exercise: IExercises;
}> = ({ exercise }) => {
  const { decrementTrials, incrementStreak } = useExerciseStore();
  const { saveUserAnswer } = useLessonStore();
  const { width } = useWindowDimensions();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerPress = (choice: string) => {
    setSelectedAnswer(choice);

    // Save user answer to the exercise object
    saveUserAnswer(exercise.id, choice);

    if (choice === exercise.answer) incrementStreak();
    else decrementTrials();
  };

  const getButtonStyle = (choice: string) => {
    if (!selectedAnswer) {
      return styles.defaultButton;
    }

    if (choice === exercise.answer) {
      return styles.correctButton;
    } else if (choice === selectedAnswer) {
      return styles.incorrectButton;
    } else {
      return styles.disabledButton;
    }
  };

  const getTextStyle = (choice: string) => {
    if (!selectedAnswer) {
      return styles.defaultText;
    }

    if (choice === exercise.answer) {
      return styles.correctText;
    } else if (choice === selectedAnswer) {
      return styles.incorrectText;
    } else {
      return styles.disabledText;
    }
  };

  const getIcon = (choice: string) => {
    if (!selectedAnswer) return null;

    if (choice === exercise.answer) {
      return (
        <Ionicons
          name="checkmark-circle"
          size={s(24)}
          color={Colors.green}
          style={styles.icon}
        />
      );
    } else if (choice === selectedAnswer) {
      return (
        <Ionicons
          name="close-circle"
          size={s(24)}
          color={Colors.red}
          style={styles.icon}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { width: width - s(40) }]}>
      <View style={styles.mainContainerStyle}>
        <Text style={styles.title}>{exercise.prompt_en}</Text>

        {/* Choices */}
        <View style={styles.choicesContainer}>
          {exercise.choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={getButtonStyle(choice)}
              onPress={() => handleAnswerPress(choice)}
              disabled={!!selectedAnswer}
            >
              <Text style={getTextStyle(choice)}>{choice}</Text>
              {getIcon(choice)}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ExerciseButton is_answered={true} disabled={!selectedAnswer} />
    </View>
  );
};

export { MultipleChoice };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(24),
  },
  mainContainerStyle: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: s(24),
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: s(24),
  },
  choicesContainer: {
    gap: s(16),
  },
  defaultButton: {
    width: '100%',
    padding: s(16),
    borderWidth: 2,
    borderColor: Colors.lightBorder,
    borderRadius: s(8),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctButton: {
    width: '100%',
    padding: s(16),
    borderWidth: 2,
    borderColor: Colors.green,
    borderRadius: s(8),
    backgroundColor: Colors.lightGreen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incorrectButton: {
    width: '100%',
    padding: s(16),
    borderWidth: 2,
    borderColor: Colors.red,
    borderRadius: s(8),
    backgroundColor: Colors.lightRed,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    width: '100%',
    padding: s(16),
    borderWidth: 2,
    borderColor: Colors.lightBorder,
    borderRadius: s(8),
    backgroundColor: Colors.white,
    opacity: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultText: {
    fontSize: s(18),
    fontWeight: 'bold',
    color: Colors.dark,
    flex: 1,
  },
  correctText: {
    fontSize: s(18),
    fontWeight: 'bold',
    color: Colors.green,
    flex: 1,
  },
  incorrectText: {
    fontSize: s(18),
    fontWeight: 'bold',
    color: Colors.red,
    flex: 1,
  },
  disabledText: {
    fontSize: s(18),
    fontWeight: 'bold',
    color: Colors.dark,
    flex: 1,
  },
  icon: {
    marginLeft: s(8),
  },
});
