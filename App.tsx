import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MainStack } from './src/navigation';
import './src/i18n'; // Initialize i18n
import { useLanguageStore } from './src/store';

function App() {
  const { hasHydrated, initializeLanguage } = useLanguageStore();

  useEffect(() => {
    if (hasHydrated) initializeLanguage();
  }, [hasHydrated, initializeLanguage]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
