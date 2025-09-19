import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale, moderateScale } from 'react-native-size-matters';
import { Text, View, Colors } from '@/ui';
import { useExerciseStore, useLessonStore } from '@/store';
import { useNavigation } from '@react-navigation/native';

const ExerciseHeader = () => {
  const {
    currentIndex,
    currentTimer,
    currentTrials,
    saveTimer,
    currentStreak,
  } = useExerciseStore();
  const { lesson } = useLessonStore();
  const exerxcises = lesson?.exercises || [];
  const Navigation = useNavigation<any>();

  // Timer logic
  useEffect(() => {
    if (currentTimer <= 0) {
      Navigation.replace('Failure');
      return;
    }

    const timer = setInterval(() => {
      saveTimer(currentTimer - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTimer, Navigation, saveTimer]);

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Timer Section */}
      <View style={styles.timerContainer}>
        <Icon
          name="access-time"
          size={moderateScale(18)}
          color={currentTimer <= 10 ? Colors.red : Colors.primary}
        />
        <Text
          style={[styles.timerText, currentTimer <= 10 && styles.timerWarning]}
        >
          {formatTime(currentTimer)}
        </Text>
      </View>

      {/* Progress Bar Section */}
      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(currentIndex / exerxcises.length) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Streak and Hearts Section */}
      <View style={styles.statsContainer}>
        {/* Streak */}
        <View style={styles.statItem}>
          <Icon
            name={'local-fire-department'}
            size={moderateScale(20)}
            color={currentStreak > 2 ? '#FF6B35' : Colors.primary}
            style={styles.streakIcon}
          />
          <Text style={styles.statText}>{currentStreak}</Text>
        </View>

        {/* Hearts */}
        <View style={styles.statItem}>
          <Icon
            name={'favorite'}
            size={moderateScale(20)}
            color={currentTrials <= 1 ? '#DC2626' : Colors.red}
            style={styles.heartIcon}
          />
          <Text style={styles.statText}>{currentTrials}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorder,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(8),
  },
  timerText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: scale(4),
  },
  timerWarning: {
    color: Colors.red,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(12),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.dark,
    marginLeft: scale(4),
  },
  streakIcon: {
    marginHorizontal: scale(2),
  },
  heartIcon: {
    marginHorizontal: scale(2),
  },
  progressBackground: {
    marginHorizontal: scale(10),
    height: scale(16),
    backgroundColor: Colors.lightBorder,
    borderRadius: scale(10),
    overflow: 'hidden',
    marginBottom: scale(4),
    alignItems: 'flex-start',
    flex: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: scale(3),
  },
  progressText: {
    fontSize: moderateScale(12),
    color: Colors.dark,
    fontWeight: '500',
  },
});

export { ExerciseHeader };
