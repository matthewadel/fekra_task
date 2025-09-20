import {
  Complete,
  ExerciseHeader,
  MatchPairs,
  MultipleChoice,
  Translation,
} from '@/components';
import { useExerciseStore, useLessonStore } from '@/store';
import { IExercises } from '@/types';
import { ScreenContainer, Text, View } from '@/ui';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { s } from 'react-native-size-matters';

const Exercise = () => {
  const { lesson } = useLessonStore();
  const exercises = lesson?.exercises;
  const FlatListRef = useRef<FlatList<IExercises>>(null);
  const { currentTrials, currentIndex } = useExerciseStore();
  const Navigation = useNavigation<any>();
  const currentTrialsRef = useRef(0);
  const NumberOfExercises = useRef(0);

  useEffect(() => {
    currentTrialsRef.current = currentTrials;
  }, [currentTrials]);

  useEffect(() => {
    NumberOfExercises.current = exercises?.length || 0;
  }, [exercises]);

  useEffect(() => {
    if (!currentTrialsRef.current) Navigation.replace('Failure');
    else if (currentIndex && currentIndex <= NumberOfExercises.current)
      setTimeout(() => {
        FlatListRef.current?.scrollToIndex({
          index: currentIndex - 1,
          animated: true,
        });
      }, 200);
    else Navigation.replace('Success');
  }, [currentIndex, Navigation]);

  const renderExercises = ({ item }: { item: IExercises }) => {
    if (item.type === 'multiple_choice')
      return <MultipleChoice exercise={item} />;
    else if (item.type === 'type_answer')
      return <Translation exercise={item} />;
    else if (item.type === 'match_pairs') return <MatchPairs exercise={item} />;
    else if (item.type === 'word_bank') return <Complete exercise={item} />;
    else return <Text>This question is not supported yet</Text>;
  };

  const itemSeperatorComponent = () => <View style={{ width: s(20) }} />;

  return (
    <ScreenContainer style={styles.container}>
      <ExerciseHeader />

      <FlatList
        scrollEnabled={false}
        ItemSeparatorComponent={itemSeperatorComponent}
        ref={FlatListRef}
        horizontal
        data={exercises}
        renderItem={renderExercises}
      />
    </ScreenContainer>
  );
};

export { Exercise };

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', alignItems: 'center' },
});
