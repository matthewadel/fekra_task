import React from 'react';
import { Text, View, Colors } from '@/ui';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { IExercises } from '@/types';
import { s, scale, moderateScale } from 'react-native-size-matters';
import { ExerciseButton } from './exercise-button';
import { useTranslation } from 'react-i18next';
import { MatchPairsContainer } from './match-pairs-container';
import { DraggableWord } from './draggable-word';
import { DropZoneComponent } from './drop-zone';

const MatchPairs: React.FC<{
  exercise: IExercises;
}> = ({ exercise }) => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  return (
    <MatchPairsContainer exercise={exercise}>
      {({
        draggableItems,
        dropZones,
        dropZoneLayouts,
        isAnswered,
        isCorrect,
        measureTimeouts,
        animationFrames,
        handleDrop,
        handleRemoveFromDropZone,
        handleDropZoneLayout,
        checkAnswer,
      }) => (
        <View style={[styles.container, { width: width - s(40) }]}>
          {/* Title */}
          <Text style={styles.title}>{t('exercise.matchPairs.title')}</Text>

          {/* Match pairs area */}
          <View style={styles.matchContainer}>
            {dropZones.map((zone, index) => (
              <DropZoneComponent
                key={zone.id}
                zone={zone}
                index={index}
                isAnswered={isAnswered}
                onRemoveFromDropZone={handleRemoveFromDropZone}
                onLayout={handleDropZoneLayout}
                measureTimeouts={measureTimeouts}
                animationFrames={animationFrames}
              />
            ))}
          </View>

          {/* Draggable items area */}
          <View style={styles.draggableContainer}>
            <Text style={styles.instructionText}>
              {t('exercise.matchPairs.instruction')}
            </Text>
            <View style={styles.draggableItems}>
              {draggableItems.map((item, index) => (
                <DraggableWord
                  key={item.id}
                  item={item}
                  index={index}
                  onDrop={handleDrop}
                  dropZoneLayouts={dropZoneLayouts}
                  isAnswered={isAnswered}
                />
              ))}
            </View>
          </View>

          {/* Exercise Button */}
          <ExerciseButton
            onPress={checkAnswer}
            disabled={dropZones.some(zone => !zone.droppedItem)}
            is_answered={isAnswered}
          />

          {/* Feedback */}
          {isAnswered && (
            <View style={styles.feedbackContainer}>
              <Text
                style={[
                  styles.feedbackText,
                  isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
                ]}
              >
                {isCorrect
                  ? t('exercise.matchPairs.correct')
                  : t('exercise.matchPairs.incorrect')}
              </Text>
            </View>
          )}
        </View>
      )}
    </MatchPairsContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: scale(20),
  },
  matchContainer: {
    flex: 1,
    marginBottom: scale(20),
  },
  draggableContainer: {
    marginBottom: scale(20),
  },
  instructionText: {
    fontSize: moderateScale(14),
    color: Colors.dark,
    marginBottom: scale(12),
    textAlign: 'center',
  },
  draggableItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: scale(8),
  },
  feedbackContainer: {
    marginTop: scale(16),
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  correctFeedback: {
    color: Colors.green,
  },
  incorrectFeedback: {
    color: Colors.red,
  },
});

export { MatchPairs };
