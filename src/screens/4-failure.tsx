import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Colors, ScreenContainer, Button } from '@/ui';
import { s } from 'react-native-size-matters';
import { useExerciseStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Failure = () => {
  const { t } = useTranslation();
  const { resetExercises, currentTimer, currentTrials, currentStreak } =
    useExerciseStore();
  const navigation = useNavigation<any>();

  // Calculate mistakes - either timeout or incorrect trials
  const mistakes = currentTimer <= 0 ? 'timeout' : 3 - currentTrials;
  const mistakeText =
    mistakes === 'timeout'
      ? t('failure.timeoutMessage')
      : t('failure.incorrectAnswers', { count: mistakes });

  const handleRestartLesson = () => {
    resetExercises();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Start' }],
    });
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Warning Triangle Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="warning" size={s(96)} color={Colors.red} />
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>{t('failure.title')}</Text>
      <Text style={styles.description}>{t('failure.description')}</Text>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {/* Mistakes Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, styles.errorIconBg]}>
            <Ionicons name="document-text" size={s(24)} color={Colors.red} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>{t('failure.mistakes')}</Text>
            <Text style={[styles.statValue, { color: Colors.red }]}>
              {mistakeText}
            </Text>
          </View>
        </View>

        {/* Current Streak Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, styles.errorIconBg]}>
            <Ionicons name="flame" size={s(24)} color={Colors.red} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>{t('failure.currentStreak')}</Text>
            <Text style={[styles.statValue, { color: Colors.red }]}>
              {t('success.streakValue', { count: currentStreak })}
            </Text>
          </View>
        </View>
      </View>

      {/* Restart Lesson Button */}
      <Button
        onPress={handleRestartLesson}
        style={styles.restartButton}
        textStyle={styles.restartButtonText}
      >
        {t('failure.restartLesson')}
      </Button>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  iconContainer: {
    marginBottom: s(32),
    alignItems: 'center',
  },
  title: {
    fontSize: s(28),
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: s(8),
  },
  description: {
    fontSize: s(16),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: s(32),
    maxWidth: s(280),
    lineHeight: s(22),
  },
  statsContainer: {
    width: '100%',
    maxWidth: s(320),
    marginBottom: s(32),
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: s(12),
    padding: s(16),
    marginBottom: s(12),
  },
  statIconContainer: {
    width: s(48),
    height: s(48),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(16),
  },
  errorIconBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: s(14),
    fontWeight: '500',
    color: Colors.dark,
    marginBottom: s(2),
  },
  statValue: {
    fontSize: s(16),
    fontWeight: '600',
    color: Colors.dark,
  },
  restartButton: {
    width: '100%',
    maxWidth: s(320),
    backgroundColor: Colors.primary,
    paddingVertical: s(16),
    borderRadius: s(12),
  },
  restartButtonText: {
    fontSize: s(16),
    fontWeight: '600',
    color: Colors.white,
  },
});

export { Failure };
