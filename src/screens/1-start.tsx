import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLanguageStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity, Colors, ScreenContainer } from '@/ui';
import { s, vs } from 'react-native-size-matters';
import { useGetLesson } from '@/hooks';

const Start = () => {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const Navigation = useNavigation<any>();
  const { lesson, loading, error, refetch } = useGetLesson();

  const handleLanguageToggle = async () => {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    await setLanguage(newLang);
  };
  console.log('lesson', lesson);
  const handleStartLesson = () => {
    Navigation.navigate('Exercise');
  };

  return (
    <ScreenContainer loading={loading} error={error} refetch={refetch}>
      <TouchableOpacity
        style={styles.langToggle}
        onPress={handleLanguageToggle}
        textStyle={styles.langToggleText}
      >
        {t('startLesson.languageToggle')}
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.main}>
        <Text style={styles.lessonTitle}>{lesson?.title}</Text>

        {/* Lesson Stats */}
        {lesson && (
          <View style={styles.lessonStats}>
            <View style={styles.statItem}>
              <MaterialIcons
                name="local-fire-department"
                size={s(18)}
                color="#FF6B35"
              />
              <View style={styles.statContent}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statLabel}
                >
                  Streak Bonus
                </Text>
                <Text style={styles.statValue}>+{lesson.streak_increment}</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <FontAwesome name="star" size={s(18)} color="#FFD700" />
              <View style={styles.statContent}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statLabel}
                >
                  XP per Correct
                </Text>
                <Text style={styles.statValue}>{lesson.xp_per_correct} XP</Text>
              </View>
            </View>
          </View>
        )}

        {/* Time Estimate Card */}
        <View style={styles.timeCard}>
          <FontAwesome name="clock-o" size={s(24)} color={Colors.primary} />
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>
              {t('startLesson.estimatedTime')}
            </Text>
            <Text style={styles.timeValue}>{t('startLesson.timeMinutes')}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartLesson}>
        <Text style={styles.startButtonText}>
          {t('startLesson.startButton')}
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  langToggle: {
    backgroundColor: Colors.primary,
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
    borderRadius: s(16),
    width: 'auto',
    alignSelf: 'flex-end',
    marginTop: s(16),
  },
  langToggleText: {
    color: Colors.white,
    fontSize: s(12),
  },

  // Main content styles
  main: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: s(24),
  },
  lessonTitle: {
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: vs(8),
    fontWeight: 'bold',
  },
  lessonDescription: {
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: vs(32),
    maxWidth: s(280),
    lineHeight: vs(22),
  },

  // Lesson stats styles
  lessonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: s(12),
    padding: s(16),
    marginBottom: vs(20),
    width: '90%',
    justifyContent: 'space-between',
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: s(3),
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statContent: {
    marginLeft: s(8),
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: s(12),
    color: '#6B7280',
    marginBottom: vs(2),
    width: '100%',
    textAlign: 'center',
    // borderWidth: 2,
  },
  statValue: {
    fontSize: s(14),
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
    width: '100%',
    // borderWidth: 2,
  },
  statDivider: {
    width: 1,
    height: s(30),
    backgroundColor: '#E5E7EB',
    marginHorizontal: s(12),
  },

  // Time card styles
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: s(12),
    padding: s(16),
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: s(2),
    elevation: 1,
  },
  timeInfo: {
    marginLeft: s(16),
  },
  timeLabel: {
    color: Colors.dark,
    fontSize: s(12),
  },
  timeValue: {
    color: Colors.dark,
    fontSize: s(16),
    marginTop: vs(2),
  },
  startButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: vs(10),
    borderRadius: s(25),
    alignItems: 'center',
    shadowColor: Colors.primary,
    marginHorizontal: s(24),
    marginBottom: vs(24),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: s(8),
    elevation: 8,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: s(18),
  },

  // Exercises section styles
  exercisesSection: {
    width: '100%',
    marginTop: vs(24),
    paddingHorizontal: s(16),
  },
  exercisesTitle: {
    fontSize: s(18),
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: vs(16),
    textAlign: 'center',
  },

  // Loading styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: s(20),
  },
  loadingText: {
    marginLeft: s(8),
    fontSize: s(14),
    color: Colors.dark,
  },

  // Exercise list styles
  exercisesList: {
    maxHeight: vs(200),
    backgroundColor: '#F8F9FA',
    borderRadius: s(8),
    padding: s(8),
  },
  exerciseCard: {
    backgroundColor: Colors.white,
    padding: s(12),
    marginBottom: vs(8),
    borderRadius: s(6),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  exerciseTitle: {
    fontSize: s(16),
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: vs(4),
  },
  exerciseDescription: {
    fontSize: s(14),
    color: '#6B7280',
    marginBottom: vs(8),
    lineHeight: vs(18),
  },
  exerciseMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseDifficulty: {
    fontSize: s(12),
    color: Colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  exerciseDuration: {
    fontSize: s(12),
    color: '#6B7280',
    fontWeight: '500',
  },
  noExercisesText: {
    fontSize: s(14),
    color: '#6B7280',
    textAlign: 'center',
    padding: s(20),
  },
});

export { Start };
