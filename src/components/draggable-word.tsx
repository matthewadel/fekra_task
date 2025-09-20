import React, { useState, useRef } from 'react';
import { Text, Colors } from '@/ui';
import { StyleSheet, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { scale, moderateScale } from 'react-native-size-matters';

interface DraggableItem {
  id: string;
  text: string;
  originalIndex: number;
}

interface DropZoneLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DraggableWordProps {
  item: DraggableItem;
  index: number;
  onDrop: (itemIndex: number, dropZoneIndex: number) => void;
  dropZoneLayouts: DropZoneLayout[];
  isAnswered: boolean;
}

const DraggableWord: React.FC<DraggableWordProps> = ({
  item,
  index,
  onDrop,
  dropZoneLayouts,
  isAnswered,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const dragViewRef = useRef<any>(null);

  // Store initial position for fallback calculation
  const initialPosition = useRef({ x: 0, y: 0 });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);

      // Store initial position
      if (dragViewRef.current) {
        dragViewRef.current.measureInWindow((x: number, y: number) => {
          initialPosition.current = { x, y };
        });
      }

      // Scale up when drag begins
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED
    ) {
      setIsDragging(false);

      // Get gesture coordinates as fallback
      const { absoluteX, absoluteY } = event.nativeEvent;

      // Use the draggable item's position to calculate drop
      if (dragViewRef.current) {
        dragViewRef.current.measureInWindow(
          (
            dragX: number,
            dragY: number,
            dragWidth: number,
            dragHeight: number,
          ) => {
            // Calculate center point of dragged item
            const dragCenterX = dragX + dragWidth / 2;
            const dragCenterY = dragY + dragHeight / 2;

            // Check if dropped on any drop zone using actual measurements
            let foundMatch = false;

            // Make sure dropZoneLayouts is properly populated
            if (dropZoneLayouts.length > 0) {
              dropZoneLayouts.forEach((layout, zoneIndex) => {
                // Check if layout is defined and has proper properties and is measured
                if (
                  layout &&
                  typeof layout.x === 'number' &&
                  typeof layout.y === 'number' &&
                  layout.width > 0 &&
                  layout.height > 0
                ) {
                  // Add reasonable padding to make drop zones responsive but not too forgiving
                  const padding = 20; // Reduced for more precise dropping
                  const expandedZone = {
                    left: layout.x - padding,
                    right: layout.x + layout.width + padding,
                    top: layout.y - padding,
                    bottom: layout.y + layout.height + padding,
                  };

                  const isOverlapping =
                    dragCenterX >= expandedZone.left &&
                    dragCenterX <= expandedZone.right &&
                    dragCenterY >= expandedZone.top &&
                    dragCenterY <= expandedZone.bottom;

                  if (isOverlapping) {
                    onDrop(index, zoneIndex);
                    foundMatch = true;
                  }
                }
              });
            }

            // If no match found with measured position, try with gesture coordinates as fallback
            if (!foundMatch) {
              dropZoneLayouts.forEach((layout, zoneIndex) => {
                if (layout && layout.width > 0 && layout.height > 0) {
                  const padding = 30; // Moderate padding for gesture coordinates
                  const isOverlapping =
                    absoluteX >= layout.x - padding &&
                    absoluteX <= layout.x + layout.width + padding &&
                    absoluteY >= layout.y - padding &&
                    absoluteY <= layout.y + layout.height + padding;

                  if (isOverlapping && !foundMatch) {
                    onDrop(index, zoneIndex);
                    foundMatch = true;
                  }
                }
              });
            }

            // If no match found, don't drop anywhere (item returns to original position)
            if (!foundMatch) {
              console.log(
                '⚠️ NO MATCH FOUND - Item will return to original position',
              );
            }

            // Reset position and scale regardless of whether dropped
            Animated.parallel([
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
              }),
              Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
              }),
              Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
              }),
            ]).start();
          },
        );
      } else {
        // Fallback: use gesture coordinates directly
        let foundMatch = false;
        dropZoneLayouts.forEach((layout, zoneIndex) => {
          if (layout && layout.width > 0 && layout.height > 0) {
            const padding = 50;
            const isOverlapping =
              absoluteX >= layout.x - padding &&
              absoluteX <= layout.x + layout.width + padding &&
              absoluteY >= layout.y - padding &&
              absoluteY <= layout.y + layout.height + padding;

            if (isOverlapping && !foundMatch) {
              onDrop(index, zoneIndex);
              foundMatch = true;
            }
          }
        });

        // Reset position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={!isAnswered}
    >
      <Animated.View
        ref={dragViewRef}
        style={[
          styles.draggableItem,
          isAnswered && styles.draggableItemDisabled,
          isDragging && styles.draggingItem,
          {
            transform: [{ translateX }, { translateY }, { scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.draggableText}>{item.text}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  draggableItem: {
    backgroundColor: Colors.primary,
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: scale(8),
    margin: scale(4),
  },
  draggableItemDisabled: {
    opacity: 0.6,
  },
  draggingItem: {
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    opacity: 0.9,
    zIndex: 1000,
  },
  draggableText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
});

export { DraggableWord };
export type { DraggableItem, DropZoneLayout };
