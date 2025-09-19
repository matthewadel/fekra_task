import React, { useState } from 'react';
import { Text, View, Colors } from '@/ui';
import { useWindowDimensions, TextInput, StyleSheet } from 'react-native';
import { IExercises } from '@/types';
import { s } from 'react-native-size-matters';
import { ExerciseButton } from './exercise-button';
import { useExerciseStore } from '@/store';

const Translation: React.FC<{
  exercise: IExercises;
}> = ({ exercise }) => {
  const { width } = useWindowDimensions();
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { decrementTrials, incrementStreak } = useExerciseStore();

  const handleTextChange = (text: string) => {
    setUserInput(text);
  };

  const validateAnswer = React.useCallback(
    (userAnswer: string) => {
      // Apply tolerance settings
      let processedUserAnswer = userAnswer;
      let processedCorrectAnswers = exercise.answer;

      // Apply case insensitive if tolerance allows
      if (exercise.tolerance?.caseInsensitive) {
        processedUserAnswer = userAnswer.toLowerCase();
        processedCorrectAnswers = (exercise.answer as string[]).map(answer =>
          answer.toLowerCase(),
        );
      }

      // Apply trim if tolerance allows
      if (exercise.tolerance?.trim) {
        processedUserAnswer = processedUserAnswer.trim();
        processedCorrectAnswers = (processedCorrectAnswers as string[]).map(
          answer => answer.trim(),
        );
      }

      // Check if user answer matches any of the correct answers
      return processedCorrectAnswers.includes(processedUserAnswer);
    },
    [exercise.answer, exercise.tolerance],
  );

  const checkAnswer = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      const correct = validateAnswer(userInput);
      setIsCorrect(correct);

      if (correct) incrementStreak();
      else decrementTrials();
    }
  };

  const getInputStyle = () => {
    if (!isAnswered) return styles.textInput;

    return [
      styles.textInput,
      isCorrect ? styles.correctInput : styles.incorrectInput,
    ];
  };

  return (
    <View style={[styles.container, { width: width - s(40) }]}>
      <View style={styles.mainContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Type the translation
        </Text>

        {/* Sentence to translate */}
        <Text style={styles.sentence}>{exercise.prompt_en}</Text>

        {/* Text input area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={getInputStyle()}
            placeholder="Type your answer here..."
            placeholderTextColor={Colors.lightBorder}
            value={userInput}
            onChangeText={handleTextChange}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isAnswered}
          />

          {/* Feedback */}
          {isAnswered && (
            <View style={styles.feedbackContainer}>
              {isCorrect ? (
                <Text style={styles.correctText}>Correct!</Text>
              ) : (
                <View>
                  <Text style={styles.incorrectText}>Incorrect</Text>
                  <Text style={styles.explanationText}>
                    {exercise.explanation}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      <ExerciseButton
        onPress={checkAnswer}
        is_answered={isAnswered}
        disabled={!userInput.length}
      />
    </View>
  );
};

export { Translation };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(16),
    paddingVertical: s(24),
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: s(28),
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: s(8),
    textAlign: 'center',
  },
  sentence: {
    fontSize: s(18),
    color: Colors.dark,
    marginBottom: s(32),
    textAlign: 'center',
    opacity: 0.7,
  },
  inputContainer: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    padding: s(16),
    borderWidth: 2,
    borderColor: Colors.lightBorder,
    backgroundColor: Colors.white,
    borderRadius: s(8),
    fontSize: s(16),
    minHeight: s(100),
    color: Colors.dark,
  },
  correctInput: {
    width: '100%',
    padding: s(16),
    borderWidth: 2,
    borderColor: Colors.green,
    backgroundColor: Colors.lightGreen,
    borderRadius: s(8),
    fontSize: s(16),
    minHeight: s(100),
    color: Colors.dark,
  },
  incorrectInput: {
    width: '100%',
    padding: s(16),
    borderWidth: 2,
    borderColor: Colors.red,
    backgroundColor: Colors.lightRed,
    borderRadius: s(8),
    fontSize: s(16),
    minHeight: s(100),
    color: Colors.dark,
  },
  feedbackContainer: {
    marginTop: s(16),
    padding: s(12),
    borderRadius: s(8),
    width: '100%',
  },
  correctText: {
    fontSize: s(16),
    fontWeight: 'bold',
    color: Colors.green,
    textAlign: 'center',
    width: '100%',
  },
  incorrectText: {
    fontSize: s(16),
    fontWeight: 'bold',
    color: Colors.red,
    textAlign: 'center',
    marginBottom: s(8),
  },
  explanationText: {
    fontSize: s(14),
    color: Colors.dark,
    textAlign: 'center',
    opacity: 0.8,
  },
});
