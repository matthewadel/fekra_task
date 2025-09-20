# Fekra Task - Language Learning App

A React Native language learning application that provides interactive exercises for learning, featuring multiple exercise types, progress tracking, and bilingual support (English/Arabic).

## 🏗️ Architecture & Design Patterns

### State Management

- **Zustand** for global state management (instead of Redux/Context)
- Persistent storage using AsyncStorage
- Modular store design with separate concerns

### Navigation

- **React Navigation v6** with Native Stack Navigator
- Screen-based navigation: Start → Exercise → Success/Failure

### Internationalization

- **i18next** for multi-language support
- Dynamic language switching (English/Arabic)
- RTL support for Arabic language
- to avoid app restart after each language change, i have created handle-rtl file which is responsible of handling RTL in the app without the need for app restart

### Styling & Responsiveness

- **react-native-size-matters** for responsive scaling
- Absolute imports using Babel module resolver
- Custom design system with centralized colors and components

## 📂 Project Structure

```
src/
├── screens/           # Main application screens
├── components/        # Reusable UI components
├── store/            # Zustand state management stores
├── navigation/       # Navigation configuration
├── ui/               # Design system (colors, base components)
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization configuration
├── types/            # TypeScript type definitions
├── context/          # React context providers
├── data/             # Static data and mock APIs
├── assets/           # Fonts, images, and static assets
└── utils/            # Utility functions
```

## 🖥️ Screens Documentation

### 1. Start Screen (`1-start.tsx`)

**Purpose:** Landing screen that displays lesson information and allows users to begin learning

**Features:**

- Language toggle button (English/Arabic)
- Lesson title and description display
- Statistics preview (streak bonus, XP per correct answer)
- Time estimate for lesson completion
- Progress continuation (resumes from last completed exercise)
- Full accessibility support for screen readers

**Key Components Used:** `ScreenContainer`, `TouchableOpacity`, `Button`, vector icons

### 2. Exercise Screen (`2-exercise.tsx`)

**Purpose:** Main learning interface that presents different types of exercises

**Features:**

- Exercise type detection and rendering
- Horizontal scrollable exercise list
- Progress tracking with exercise header
- Automatic navigation between exercises
- Timer and trials management
- Navigation to success/failure based on performance

**Exercise Types Supported:**

- Multiple Choice (`MultipleChoice`)
- Type Answer (`Translation`)
- Match Pairs (`MatchPairs`)
- Word Bank (`Complete`)

### 3. Success Screen (`3-success.tsx`)

**Purpose:** Congratulatory screen shown upon successful lesson completion

**Features:**

- Celebration animation with haptic feedback
- XP earned display
- Streak increment visualization
- Lesson restart functionality
- Automatic state reset for next lesson

### 4. Failure Screen (`4-failure.tsx`)

**Purpose:** Encouragement screen shown when user fails the lesson

**Features:**

- Failure reason display (timeout vs. incorrect answers)
- Current streak preservation
- Mistake count visualization
- Haptic feedback for errors
- Lesson restart capability

## 🧩 Components Documentation

### Exercise Components

#### `MultipleChoice`

- Renders multiple choice questions with selectable options
- Visual feedback (correct/incorrect/disabled states)
- Answer validation and state management
- Handles user interaction and score tracking

#### `Translation` (Type Answer)

- Text input field for typing translations
- Case-insensitive and trimmed validation
- Real-time answer checking
- Input sanitization and tolerance handling

#### `MatchPairs`

- Drag and drop interface for matching words/phrases
- Visual pairing feedback
- Gesture handling for intuitive interactions
- Success/failure state management

#### `Complete` (Word Bank)

- Drag and drop word ordering exercise
- Enforces correct sequence building
- Visual feedback for word placement
- Validates complete phrase construction

### UI Components

#### `ExerciseHeader`

- Progress bar visualization
- Timer display with countdown
- Trials (hearts) remaining indicator
- Responsive layout for different screen sizes

#### `ExerciseButton`

- Standardized button for exercise actions
- Continue/Check state management
- Accessibility support
- Custom styling and animations

#### `CelebrationAnimation`

- Success animation using Skia
- Configurable size and colors
- Trigger-based animation control
- Performance optimized rendering

### Utility Components

#### `ScreenContainer`

- Base container for all screens
- Loading state management
- Error handling and retry functionality
- Consistent padding and layout
- SafeArea integration

#### `Button`, `TouchableOpacity`, `Text`, `View`

- Enhanced versions of React Native components
- Built-in RTL support
- Accessibility properties
- Consistent styling system

## 🗄️ State Management (Zustand Stores)

### `exerciseStore.ts`

**Purpose:** Manages exercise progress and user performance

**State:**

- `currentStreak`: User's current success streak
- `currentIndex`: Current exercise position
- `currentTimer`: Remaining time for exercises
- `currentTrials`: Remaining attempts (hearts)

**Actions:**

- `incrementStreak()`: Increases streak on correct answers
- `increaseCurrentIndex()`: Moves to next exercise
- `saveTimer()`: Persists timer state
- `decrementTrials()`: Reduces attempts on wrong answers
- `resetExercises()`: Clears state for new lesson

### `languageStore.ts`

**Purpose:** Handles application language and i18n integration

**State:**

- `currentLanguage`: Active language code ('en'/'ar')
- `hasHydrated`: Initialization status flag

**Actions:**

- `setLanguage()`: Changes app language and updates i18n
- `initializeLanguage()`: Loads saved language on app start
- `toggleHydrateState()`: Manages hydration status

### `lessonStore.ts`

**Purpose:** Manages lesson data and user answers

**State:**

- `lesson`: Current lesson data and structure
- `loading`: API request state
- `error`: Error message handling

**Actions:**

- `setLesson()`: Updates current lesson data
- `saveUserAnswer()`: Stores user responses per exercise
- `clearLesson()`: Resets lesson state

## 🔌 Third-Party Libraries

### Core Dependencies

#### **React Navigation (@react-navigation/native)**

- **Purpose:** Screen navigation and routing
- **Usage:** Stack-based navigation between app screens
- **Benefits:** Native performance, gesture support, deep linking ready

#### **Zustand (zustand)**

- **Purpose:** State management solution
- **Usage:** Global state with persistence
- **Benefits:** Minimal boilerplate, TypeScript support, smaller bundle size than Redux

#### **i18next + react-i18next**

- **Purpose:** Internationalization and localization
- **Usage:** Multi-language support (English/Arabic)
- **Benefits:** Dynamic language switching, namespace support, interpolation

#### **AsyncStorage (@react-native-async-storage/async-storage)**

- **Purpose:** Local data persistence
- **Usage:** Store user progress, settings, and language preferences
- **Benefits:** Asynchronous, encrypted on iOS, large capacity

### UI & Animation Libraries

#### **React Native Reanimated (react-native-reanimated)**

- **Purpose:** High-performance animations
- **Usage:** Smooth transitions and interactive animations
- **Benefits:** 60fps animations, gesture-driven interactions

#### **React Native Gesture Handler (react-native-gesture-handler)**

- **Purpose:** Advanced gesture recognition
- **Usage:** Drag and drop, swipe interactions in exercises
- **Benefits:** Native gesture processing, better performance

#### **React Native Vector Icons (react-native-vector-icons)**

- **Purpose:** Icon library with multiple icon sets
- **Usage:** UI icons throughout the app (FontAwesome, Ionicons, MaterialIcons)
- **Benefits:** Scalable vectors, extensive icon collection, customizable

### Developer Experience Libraries

#### **React Native Size Matters (react-native-size-matters)**

- **Purpose:** Responsive design scaling
- **Usage:** Device-independent sizing and positioning
- **Benefits:** Consistent UI across different screen sizes

#### **React Native Haptic Feedback (react-native-haptic-feedback)**

- **Purpose:** Tactile user feedback
- **Usage:** Success/error haptic notifications
- **Benefits:** Enhanced user experience, accessibility support

#### **React Native Safe Area Context (react-native-safe-area-context)**

- **Purpose:** Safe area management
- **Usage:** Proper padding for notched devices
- **Benefits:** Automatic safe area detection, cross-platform support

## 📱 Features

### Accessibility Support

- **Screen Reader Compatibility:** Full VoiceOver/TalkBack support
- **Descriptive Labels:** All interactive elements have proper accessibility labels
- **Multilingual Accessibility:** Accessibility descriptions in both English and Arabic
- **Semantic Structure:** Proper use of accessibility roles and hints

### Responsive Design

- **Cross-Device Support:** Optimized for phones and tablets
- **Safe Area Handling:** Proper padding for notched devices
- **Keyboard Avoidance:** ScrollView integration for keyboard interactions
- **Orientation Support:** Layout adapts to device rotation

### Performance Optimizations

- **State Persistence:** Progress saved locally using AsyncStorage
- **Lazy Loading:** Components rendered on demand
- **Memory Management:** Proper cleanup of timers and listeners
- **Native Animations:** Hardware-accelerated animations using Reanimated

### User Experience

- **Haptic Feedback:** Tactile responses for user actions
- **Progress Tracking:** Visual progress indicators and streak counting
- **Error Handling:** Graceful error states with retry mechanisms
- **Offline Support:** Core functionality works without internet

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment
- iOS Simulator / Android Emulator

### Installation

```bash
npm install
npx pod-install ios  # iOS only
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Start Metro bundler
npm start
```

### Testing

```bash
npm test
```

## 🏛️ Architecture Benefits

### Zustand over Redux

- **Minimal Boilerplate:** Less code for state management
- **TypeScript Integration:** Better type inference and safety
- **Performance:** Selective subscriptions and optimized renders
- **Bundle Size:** Smaller footprint compared to Redux ecosystem

### ScrollView Integration

- **Keyboard Handling:** Automatic scrolling when keyboard appears
- **Small Screen Support:** Content remains accessible on smaller devices
- **Content Overflow:** Prevents UI elements from being cut off
- **User Experience:** Smooth scrolling interactions

### Absolute Imports

- **Code Organization:** Cleaner import statements using `@/` prefix
- **Maintainability:** Easier refactoring and file organization
- **Developer Experience:** Better IDE support and autocomplete

This language learning app demonstrates modern React Native development practices with a focus on user experience, accessibility, and maintainable code architecture.
