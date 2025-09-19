import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { s } from 'react-native-size-matters';
import { Colors } from '@/ui';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CelebrationAnimationProps {
  trigger?: boolean;
  size?: number;
  color?: string;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  trigger = false,
  size = s(96),
  color = Colors.primary,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      // Simple scale up animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      // Subtle bounce effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 },
      ).start();
    }
  }, [trigger, scaleAnim, bounceAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.star,
          {
            transform: [{ scale: scaleAnim }, { scale: bounceAnim }],
          },
        ]}
      >
        <Ionicons name="star" size={size} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { CelebrationAnimation };
