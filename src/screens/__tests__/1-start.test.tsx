import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock all the dependencies before importing the component
jest.mock('@/store', () => ({
  useLanguageStore: () => ({
    currentLanguage: 'en',
    setLanguage: jest.fn().mockResolvedValue(undefined),
  }),
  useLessonStore: () => ({
    lesson: {
      title: 'Basic Vocabulary',
      streak_increment: 5,
      xp_per_correct: 10,
      exercises: [{ id: 1, type: 'mcq', question: 'Test question' }],
    },
  }),
  useExerciseStore: () => ({
    currentIndex: 0,
    increaseCurrentIndex: jest.fn(),
  }),
}));

jest.mock('@/hooks', () => ({
  useGetLesson: () => ({
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock('@/ui', () => ({
  Text: ({ children, ...props }) => {
    const { Text: RNText } = require('react-native');
    return <RNText {...props}>{children}</RNText>;
  },
  View: ({ children, ...props }) => {
    const { View: RNView } = require('react-native');
    return <RNView {...props}>{children}</RNView>;
  },
  TouchableOpacity: ({ children, onPress, ...props }) => {
    const { TouchableOpacity: RNTouchableOpacity } = require('react-native');
    return (
      <RNTouchableOpacity onPress={onPress} {...props}>
        {children}
      </RNTouchableOpacity>
    );
  },
  ScreenContainer: ({ children, loading, error, refetch }) => {
    const { View } = require('react-native');
    if (loading) return <View testID="loading" />;
    if (error) return <View testID="error" />;
    return <View>{children}</View>;
  },
  Button: ({ children, onPress, ...props }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
  Colors: {
    primary: '#007AFF',
    white: '#FFFFFF',
    dark: '#000000',
  },
}));

const mockNavigation = {
  replace: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useFocusEffect: jest.fn(),
}));

// Now import the component after all mocks are set up
import { Start } from '../1-start';

describe('Start Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the start screen without crashing', () => {
    const { getByText } = render(<Start />);
    expect(getByText('Basic Vocabulary')).toBeTruthy();
  });

  it('displays the lesson title', () => {
    const { getByText } = render(<Start />);
    expect(getByText('Basic Vocabulary')).toBeTruthy();
  });

  it('shows start lesson button', () => {
    const { getByText } = render(<Start />);
    expect(getByText('startLesson.startButton')).toBeTruthy();
  });

  it('displays lesson statistics', () => {
    const { getByLabelText } = render(<Start />);
    // Check accessibility labels for lesson statistics
    expect(
      getByLabelText('startLesson.accessibility.streakBonusLabel'),
    ).toBeTruthy();
    expect(
      getByLabelText('startLesson.accessibility.xpPerCorrectLabel'),
    ).toBeTruthy();
  });

  it('navigates to Exercise screen when start button is pressed', () => {
    const { getByText } = render(<Start />);
    const startButton = getByText('startLesson.startButton');

    fireEvent.press(startButton);

    expect(mockNavigation.replace).toHaveBeenCalledWith('Exercise');
  });
});
