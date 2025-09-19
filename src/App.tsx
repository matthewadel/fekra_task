import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    <SafeAreaProvider>
      <ScreenDimensionsProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </ScreenDimensionsProvider>
    </SafeAreaProvider>
  );
}

export default App;
