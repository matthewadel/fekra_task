import React, { useEffect, useState } from 'react';
import { Text, View, Colors, ScreenContainer, Button } from '@/ui';
import { StyleSheet } from 'react-native';
import { s } from 'react-native-size-matters';
import { useLessonStore, useExerciseStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CelebrationAnimation } from '@/components';
import { useHapticFeedback } from '@/hooks';
import { Balloons } from 'react-native-fiesta';

const Success = () => {
  const { t } = useTranslation();
  const { lesson } = useLessonStore();
  const { resetExercises, currentStreak } = useExerciseStore();
  const navigation = useNavigation<any>();
  const [showCelebration, setShowCelebration] = useState(false);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    // Trigger haptic feedback and celebration animation when component mounts
    triggerHaptic('success');

    // Small delay to ensure the screen has loaded
    const timer = setTimeout(() => {
      setShowCelebration(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [triggerHaptic]);

  const handleRestartLesson = () => {
    // Light haptic feedback on button press
    triggerHaptic('light');

    resetExercises(); // Reset exercise state to start from beginning
    navigation.reset({
      index: 0,
      routes: [{ name: 'Start' }],
    });
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Celebration Animation */}
      <Balloons />

      <View style={styles.iconContainer}>
        <CelebrationAnimation
          trigger={showCelebration}
          size={s(96)}
          color={Colors.primary}
        />
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>{t('success.title')}</Text>
      <Text style={styles.description}>{t('success.description')}</Text>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {/* XP Earned Card */}
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star" size={s(24)} color={Colors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>{t('success.xpEarned')}</Text>
            <Text style={styles.statValue}>+{lesson?.xp_per_correct} XP</Text>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="flame" size={s(24)} color={Colors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>{t('success.streakIncreased')}</Text>
            <Text style={styles.statValue}>
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
        {t('success.restartLesson')}
      </Button>
    </ScreenContainer>
  );
};

export { Success };

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(16),
  },
  iconContainer: {
    marginBottom: s(32),
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
    color: Colors.dark,
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: s(280),
    lineHeight: s(24),
    marginBottom: s(32),
  },
  statsContainer: {
    width: '100%',
    maxWidth: s(300),
    gap: s(16),
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
    backgroundColor: Colors.dark + '0D', // black/5
    borderRadius: s(12),
    padding: s(16),
  },
  statIconContainer: {
    width: s(48),
    height: s(48),
    borderRadius: s(12),
    backgroundColor: Colors.primary + '33', // primary/20
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: s(16),
    fontWeight: '500',
    color: Colors.dark,
    marginBottom: s(2),
  },
  statValue: {
    fontSize: s(16),
    fontWeight: '500',
    color: Colors.primary,
  },
  restartButton: {
    marginTop: s(32),
    marginBottom: s(16),
    backgroundColor: Colors.primary,
    borderRadius: s(12),
    paddingVertical: s(16),
    paddingHorizontal: s(32),
    minWidth: s(200),
  },
  restartButtonText: {
    color: Colors.white,
    fontSize: s(16),
    fontWeight: '600',
  },
});
