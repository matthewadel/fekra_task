import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as screens from '@/screens';

const Stack = createNativeStackNavigator();

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Start" component={screens.Start} />
      <Stack.Screen name="Exercise" component={screens.Exercise} />
      <Stack.Screen name="success" component={screens.success} />
      <Stack.Screen name="failure" component={screens.failure} />
    </Stack.Navigator>
  );
};
