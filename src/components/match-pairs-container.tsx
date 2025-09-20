import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useExerciseStore, useLessonStore } from '@/store';
import type { DraggableItem, DropZoneLayout } from './draggable-word';
import type { DropZone } from './drop-zone';
import { IExercises } from '@/types';

interface MatchPairsContainerProps {
  exercise: IExercises;
  children: (props: MatchPairsContainerState) => React.ReactNode;
}

interface MatchPairsContainerState {
  draggableItems: DraggableItem[];
  dropZones: DropZone[];
  dropZoneLayouts: DropZoneLayout[];
  isAnswered: boolean;
  isCorrect: boolean | null;
  measureTimeouts: React.MutableRefObject<{ [key: number]: number }>;
  animationFrames: React.MutableRefObject<{ [key: number]: number }>;
  handleDrop: (itemIndex: number, dropZoneIndex: number) => void;
  handleRemoveFromDropZone: (zoneIndex: number) => void;
  handleDropZoneLayout: (index: number, layout: DropZoneLayout) => void;
  checkAnswer: () => void;
}

const MatchPairsContainer: React.FC<MatchPairsContainerProps> = ({
  exercise,
  children,
}) => {
  const { decrementTrials, incrementStreak } = useExerciseStore();
  const { saveUserAnswer } = useLessonStore();

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize draggable items (right values, shuffled)
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>(() => {
    const items = exercise.pairs.map((pair, index) => ({
      id: `right-${index}`,
      text: pair.right,
      originalIndex: index,
    }));
    return shuffleArray(items);
  });

  // Initialize drop zones (left values with placeholders for right values)
  const [dropZones, setDropZones] = useState<DropZone[]>(
    exercise.pairs.map((pair, index) => ({
      id: `zone-${index}`,
      leftText: pair.left,
      rightText: pair.right, // for validation
      droppedItem: null,
    })),
  );

  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [dropZoneLayouts, setDropZoneLayouts] = useState<DropZoneLayout[]>(
    exercise.pairs.map(() => ({ x: 0, y: 0, width: 0, height: 0 })),
  );

  // Store timeout references to clean them up if needed
  const measureTimeouts = useRef<{ [key: number]: number }>({});
  const animationFrames = useRef<{ [key: number]: number }>({});

  // Cleanup timeouts and animation frames on unmount
  useEffect(() => {
    const timeouts = measureTimeouts.current;
    const frames = animationFrames.current;
    return () => {
      Object.values(timeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      Object.values(frames).forEach(frame => {
        if (frame) cancelAnimationFrame(frame);
      });
    };
  }, []);

  // Animation values for each draggable item
  const animatedValues = useRef(
    draggableItems.map(() => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1),
    })),
  ).current;

  const handleDrop = (itemIndex: number, dropZoneIndex: number) => {
    const item = draggableItems[itemIndex];

    // Update drop zones
    const newDropZones = [...dropZones];

    // Remove item from any existing drop zone
    newDropZones.forEach(zone => {
      if (zone.droppedItem?.id === item.id) {
        zone.droppedItem = null;
      }
    });

    // Add item to new drop zone (replace existing item if any)
    if (newDropZones[dropZoneIndex].droppedItem) {
      // Return the existing item to draggable area
      const existingItem = newDropZones[dropZoneIndex].droppedItem!;
      setDraggableItems(prev => [
        ...prev.filter(d => d.id !== existingItem.id),
        existingItem,
      ]);
    }

    newDropZones[dropZoneIndex].droppedItem = item;
    setDropZones(newDropZones);

    // Remove item from draggable items
    setDraggableItems(prev => prev.filter(d => d.id !== item.id));

    // Reset animation
    Animated.parallel([
      Animated.timing(animatedValues[itemIndex].translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[itemIndex].translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[itemIndex].scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRemoveFromDropZone = (zoneIndex: number) => {
    const zone = dropZones[zoneIndex];
    if (zone.droppedItem) {
      // Return item to draggable area
      setDraggableItems(prev => [...prev, zone.droppedItem!]);

      // Clear drop zone
      const newDropZones = [...dropZones];
      newDropZones[zoneIndex].droppedItem = null;
      setDropZones(newDropZones);
    }
  };

  const handleDropZoneLayout = (index: number, layout: DropZoneLayout) => {
    setDropZoneLayouts(prevLayouts => {
      const newLayouts = [...prevLayouts];
      // Ensure we have a valid index and don't exceed array bounds
      if (index >= 0 && index < newLayouts.length) {
        newLayouts[index] = layout;
      }
      return newLayouts;
    });
  };

  const checkAnswer = () => {
    if (!isAnswered) {
      setIsAnswered(true);

      // Check if all zones are filled correctly
      const allCorrect = dropZones.every(
        zone => zone.droppedItem && zone.droppedItem.text === zone.rightText,
      );

      setIsCorrect(allCorrect);

      // Save user answer (array of right answers in order)
      const userAnswers = dropZones.map(zone => zone.droppedItem?.text || '');
      saveUserAnswer(exercise.id, userAnswers);

      if (allCorrect) incrementStreak();
      else decrementTrials();
    }
  };

  const containerState: MatchPairsContainerState = {
    draggableItems,
    dropZones,
    dropZoneLayouts,
    isAnswered,
    isCorrect,
    measureTimeouts,
    animationFrames,
    handleDrop,
    handleRemoveFromDropZone,
    handleDropZoneLayout,
    checkAnswer,
  };

  return <>{children(containerState)}</>;
};

export { MatchPairsContainer };
export type { MatchPairsContainerState };
