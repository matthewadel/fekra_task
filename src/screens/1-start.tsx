import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useLanguageStore } from '../store';
import { SafeAreaView } from 'react-native-safe-area-context';

// type StartLessonScreenProps = NativeStackScreenProps<
//   RootStackParamList,
//   'StartLesson'
// >;

// const StartLessonScreen: React.FC<StartLessonScreenProps> = () => {
const StartLessonScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();

  const handleLanguageToggle = async () => {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    await setLanguage(newLang);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Switcher */}
      <View style={styles.languageSwitcher}>
        <TouchableOpacity
          style={styles.langButton}
          onPress={handleLanguageToggle}
        >
          <Text style={styles.langButtonText}>
            {currentLanguage === 'en' ? 'عربي' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('startLesson.title')}</Text>
        <Text style={styles.subtitle}>{t('startLesson.subtitle')}</Text>

        <FontAwesome
          name="rocket"
          size={60}
          color="#007AFF"
          style={styles.icon}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  languageSwitcher: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  langButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  langButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  icon: {
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    width: '80%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 16,
    width: '90%',
  },
});

export default StartLessonScreen;
