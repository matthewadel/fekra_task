import React, { useState } from 'react';
import { Text, View, Colors, TouchableOpacity } from '@/ui';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { IExercises } from '@/types';
import { s } from 'react-native-size-matters';
import { ExerciseButton } from './exercise-button';
import { useExerciseStore, useLessonStore } from '@/store';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Complete: React.FC<{
  exercise: IExercises;
}> = ({ exercise }) => {
  const { width } = useWindowDimensions();
  const { decrementTrials, incrementStreak } = useExerciseStore();
  const { saveUserAnswer } = useLessonStore();

  // State for selected answers in order
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    new Array(exercise.answer.length).fill(''),
  );

  // State for tracking which bank words are used
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());

  // State for checking answer
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleWordPress = (word: string, bankIndex: number) => {
    if (isAnswered || usedWords.has(bankIndex)) return;

    // Find the first empty slot
    const emptySlotIndex = selectedAnswers.findIndex(answer => answer === '');
    if (emptySlotIndex !== -1) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[emptySlotIndex] = word;
      setSelectedAnswers(newSelectedAnswers);

      const newUsedWords = new Set(usedWords);
      newUsedWords.add(bankIndex);
      setUsedWords(newUsedWords);

      // Check if all slots are filled (button will be enabled when all filled)
    }
  };

  const handlePlaceholderPress = (index: number) => {
    if (isAnswered || selectedAnswers[index] === '') return;

    // Find the bank index of the word being removed
    const wordToRemove = selectedAnswers[index];
    const bankIndex = exercise.bank.findIndex(word => word === wordToRemove);

    // Clear the slot and mark word as available
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = '';
    setSelectedAnswers(newSelectedAnswers);

    const newUsedWords = new Set(usedWords);
    newUsedWords.delete(bankIndex);
    setUsedWords(newUsedWords);
  };

  const checkAnswer = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      const userAnswer = selectedAnswers.join(' ').toLowerCase().trim();
      const correctAnswer = (exercise.answer as string[])
        .join(' ')
        .toLowerCase()
        .trim();
      const correct = userAnswer === correctAnswer;

      setIsCorrect(correct);

      // Save user answer to the exercise object (save the array of selected answers)
      saveUserAnswer(exercise.id, selectedAnswers);

      if (correct) incrementStreak();
      else decrementTrials();
    }
  };

  const renderPlaceholders = () => {
    return selectedAnswers.map((answer, index) => (
      <TouchableOpacity
        disabled={isAnswered}
        key={index}
        style={[
          styles.placeholder,
          answer !== '' && styles.filledPlaceholder,
          isAnswered && isCorrect && styles.correctPlaceholder,
          isAnswered && !isCorrect && styles.incorrectPlaceholder,
        ]}
        onPress={() => handlePlaceholderPress(index)}
      >
        <Text style={styles.placeholderText}>{answer || '_____'}</Text>
        {answer !== '' && !isAnswered && (
          <Ionicons
            name="close-circle"
            size={s(18)}
            color={Colors.dark}
            style={styles.closeIcon}
          />
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <View style={[styles.container, { width: width - s(40) }]}>
      <View style={styles.mainContainer}>
        {/* Title */}
        <Text style={styles.title}>Complete the sentence</Text>

        {/* Sentence with placeholders */}
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentenceText}>{exercise.prompt_en}</Text>
          <View style={styles.sentenceRow}>{renderPlaceholders()}</View>
        </View>

        {/* Word bank */}
        <View style={styles.wordBankContainer}>
          {exercise.bank.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.wordButton,
                usedWords.has(index) && styles.usedWordButton,
                isAnswered && styles.disabledWordButton,
              ]}
              onPress={() => handleWordPress(word, index)}
              disabled={usedWords.has(index) || isAnswered}
            >
              <Text
                style={[
                  styles.wordButtonText,
                  usedWords.has(index) && styles.usedWordButtonText,
                ]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        {isAnswered && (
          <View style={styles.feedbackContainer}>
            <Text style={isCorrect ? styles.correctText : styles.incorrectText}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </Text>
            {!isCorrect && (
              <Text style={styles.explanationText}>{exercise.explanation}</Text>
            )}
          </View>
        )}
      </View>
      <ExerciseButton
        onPress={checkAnswer}
        is_answered={isAnswered}
        disabled={selectedAnswers.includes('')}
      />
    </View>
  );
};

export { Complete };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingVertical: s(32),
    paddingBottom: s(16),
    width: '100%',
  },
  title: {
    fontSize: s(24),
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.dark,
    marginBottom: s(32),
  },
  sentenceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(32),
    width: '100%',
  },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: s(8),
    width: '100%',
  },
  sentenceText: {
    fontSize: s(20),
    color: Colors.dark,
    opacity: 0.6,
  },
  placeholder: {
    minWidth: s(96),
    height: s(48),
    borderRadius: s(8),
    backgroundColor: Colors.primary + '33', // primary/20
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: s(4),
    flexDirection: 'row',
    paddingHorizontal: s(8),
  },
  filledPlaceholder: {
    backgroundColor: Colors.primary + '66', // primary/40
  },
  correctPlaceholder: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
    borderWidth: 2,
  },
  incorrectPlaceholder: {
    backgroundColor: Colors.lightRed,
    borderColor: Colors.red,
    borderWidth: 2,
  },
  placeholderText: {
    fontSize: s(16),
    fontWeight: '500',
    color: Colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  closeIcon: {
    marginLeft: s(4),
  },
  wordBankContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: s(12),
    paddingTop: s(24),
  },
  wordButton: {
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    borderRadius: s(8),
    borderWidth: 2,
    borderColor: Colors.primary + '33', // primary/20
    backgroundColor: 'transparent',
  },
  usedWordButton: {
    opacity: 0.3,
  },
  disabledWordButton: {
    opacity: 0.5,
  },
  wordButtonText: {
    fontSize: s(18),
    fontWeight: '500',
    color: Colors.dark,
  },
  usedWordButtonText: {
    color: Colors.dark,
  },
  feedbackContainer: {
    marginTop: s(16),
    padding: s(12),
    borderRadius: s(8),
    alignItems: 'center',
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
