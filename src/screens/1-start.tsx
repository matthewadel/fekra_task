import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useExerciseStore, useLanguageStore, useLessonStore } from '@/store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  TouchableOpacity,
  Colors,
  ScreenContainer,
  Button,
} from '@/ui';
import { s, vs } from 'react-native-size-matters';
import { useGetLesson } from '@/hooks';

const Start = () => {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const Navigation = useNavigation<any>();
  const { loading, error, refetch } = useGetLesson();
  const { lesson } = useLessonStore();
  const { currentIndex, increaseCurrentIndex } = useExerciseStore();

  const handleLanguageToggle = async () => {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    await setLanguage(newLang);
  };
  console.log('lesson', lesson);
  useFocusEffect(
    useCallback(() => {
      let executionTimeout: ReturnType<typeof setTimeout>;
      console.log('currentIndex', currentIndex);
      console.log(
        'userAnswer',
        lesson?.exercises[currentIndex - 1]?.userAnswer,
      );
      console.log('lesson', lesson);
      if (currentIndex) {
        executionTimeout = setTimeout(() => {
          if (lesson?.exercises[currentIndex - 1]?.userAnswer)
            increaseCurrentIndex();
          Navigation.replace('Exercise');
        }, 500);
      }

      return () => clearTimeout(executionTimeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, Navigation, lesson]),
  );

  const handleStartLesson = () => {
    if (!currentIndex || lesson?.exercises[currentIndex - 1]?.userAnswer)
      increaseCurrentIndex();
    Navigation.replace('Exercise');
  };

  return (
    <ScreenContainer loading={loading} error={error} refetch={refetch}>
      <TouchableOpacity
        style={styles.langToggle}
        onPress={handleLanguageToggle}
        textStyle={styles.langToggleText}
        accessibilityRole="button"
        accessibilityLabel={t('startLesson.accessibility.languageToggleLabel')}
        accessibilityHint={t('startLesson.accessibility.languageToggleHint')}
      >
        {t('startLesson.languageToggle')}
      </TouchableOpacity>

      {/* Main Content */}
      <View
        style={styles.main}
        accessibilityLabel={t('startLesson.accessibility.screenTitle')}
      >
        <Text
          style={styles.lessonTitle}
          accessibilityRole="header"
          accessibilityLabel={t('startLesson.accessibility.lessonTitleLabel', {
            title: lesson?.title || '',
          })}
        >
          {lesson?.title}
        </Text>

        {/* Lesson Stats */}
        {lesson && (
          <View style={styles.lessonStats}>
            <View
              style={styles.statItem}
              accessibilityRole="text"
              accessibilityLabel={t(
                'startLesson.accessibility.streakBonusLabel',
                { bonus: lesson.streak_increment },
              )}
            >
              <MaterialIcons
                name="local-fire-department"
                size={s(18)}
                color="#FF6B35"
                accessibilityElementsHidden={true}
                importantForAccessibility="no-hide-descendants"
              />
              <View style={styles.statContent}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statLabel}
                  accessibilityElementsHidden={true}
                >
                  {t('startLesson.streakBonus')}
                </Text>
                <Text
                  style={styles.statValue}
                  accessibilityElementsHidden={true}
                >
                  +{lesson.streak_increment}
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View
              style={styles.statItem}
              accessibilityRole="text"
              accessibilityLabel={t(
                'startLesson.accessibility.xpPerCorrectLabel',
                { xp: lesson.xp_per_correct },
              )}
            >
              <FontAwesome
                name="star"
                size={s(18)}
                color="#FFD700"
                accessibilityElementsHidden={true}
                importantForAccessibility="no-hide-descendants"
              />
              <View style={styles.statContent}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statLabel}
                  accessibilityElementsHidden={true}
                >
                  {t('startLesson.xpPerCorrect')}
                </Text>
                <Text
                  style={styles.statValue}
                  accessibilityElementsHidden={true}
                >
                  {lesson.xp_per_correct} XP
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Time Estimate Card */}
        <View
          style={styles.timeCard}
          accessibilityRole="text"
          accessibilityLabel={t('startLesson.accessibility.timeEstimateLabel', {
            time: t('startLesson.timeMinutes'),
          })}
        >
          <FontAwesome
            name="clock-o"
            size={s(24)}
            color={Colors.primary}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          />
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel} accessibilityElementsHidden={true}>
              {t('startLesson.estimatedTime')}
            </Text>
            <Text style={styles.timeValue} accessibilityElementsHidden={true}>
              {t('startLesson.timeMinutes')}
            </Text>
          </View>
        </View>
      </View>

      <Button
        onPress={handleStartLesson}
        style={styles.buttonStyle}
        accessibilityRole="button"
        accessibilityLabel={t('startLesson.accessibility.startButtonLabel')}
        accessibilityHint={t('startLesson.accessibility.startButtonHint')}
      >
        {t('startLesson.startButton')}
      </Button>
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
  buttonStyle: {
    marginHorizontal: s(24),
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
});

export { Start };
