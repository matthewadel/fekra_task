import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartLessonScreen from '../screens/1-start';

const Stack = createNativeStackNavigator();

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="StartLesson"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="StartLesson" component={StartLessonScreen} />
    </Stack.Navigator>
  );
};
