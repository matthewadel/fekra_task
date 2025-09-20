import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { MainStack } from './navigation';
import './i18n'; // Initialize i18n
import { useLanguageStore } from './store';
import { ScreenDimensionsProvider } from './context';

function App() {
  const { hasHydrated, initializeLanguage } = useLanguageStore();

  useEffect(() => {
    if (hasHydrated) initializeLanguage();
  }, [hasHydrated, initializeLanguage]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ScreenDimensionsProvider>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </ScreenDimensionsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
