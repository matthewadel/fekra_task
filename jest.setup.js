import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock react-native-haptic-feedback
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

// Mock react-native-size-matters
jest.mock('react-native-size-matters', () => ({
  s: jest.fn(size => size),
  vs: jest.fn(size => size),
  ms: jest.fn(size => size),
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options = {}) => {
      // Simple mock that returns the key or interpolated string
      if (options && Object.keys(options).length > 0) {
        let result = key;
        Object.entries(options).forEach(([optKey, value]) => {
          result = result.replace(`{{${optKey}}}`, value);
        });
        return result;
      }
      return key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock the entire i18n module
jest.mock('@/i18n', () => ({
  default: {
    use: jest.fn(() => ({
      init: jest.fn(),
    })),
    t: jest.fn(key => key),
    changeLanguage: jest.fn(),
  },
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useFocusEffect: jest.fn(),
}));

// Console.log suppression for cleaner test output
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
});
