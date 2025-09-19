import React from 'react';
import { Text, View } from '@/ui';
import { useWindowDimensions } from 'react-native';
import { IExercises } from '@/types';
import { s } from 'react-native-size-matters';

const MatchPairs: React.FC<{
  exercise: IExercises;
}> = ({ exercise }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width: width - s(40), borderWidth: 2, borderColor: '#F00' }}>
      <Text>MatchPairs</Text>
      <Text>{exercise.id}</Text>
    </View>
  );
};

export { MatchPairs };
