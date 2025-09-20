import React from 'react';
import { Text, View, Colors, TouchableOpacity } from '@/ui';
import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '@/i18n';
import type { DraggableItem, DropZoneLayout } from './draggable-word';

interface DropZone {
  id: string;
  leftText: string;
  rightText: string;
  droppedItem: DraggableItem | null;
}

interface DropZoneComponentProps {
  zone: DropZone;
  index: number;
  isAnswered: boolean;
  onRemoveFromDropZone: (zoneIndex: number) => void;
  onLayout: (index: number, layout: DropZoneLayout) => void;
  measureTimeouts: React.MutableRefObject<{ [key: number]: number }>;
  animationFrames: React.MutableRefObject<{ [key: number]: number }>;
}

const DropZoneComponent: React.FC<DropZoneComponentProps> = ({
  zone,
  index,
  isAnswered,
  onRemoveFromDropZone,
  onLayout,
  measureTimeouts,
  animationFrames,
}) => {
  const { t } = useTranslation();

  const handleLayout = (event: any) => {
    // Store the target reference to avoid null issues
    const target = event.currentTarget;
    if (!target) return;

    // Clear any existing timeout/animation frame for this zone
    if (measureTimeouts.current[index]) {
      clearTimeout(measureTimeouts.current[index]);
    }
    if (animationFrames.current[index]) {
      cancelAnimationFrame(animationFrames.current[index]);
    }

    // Use requestAnimationFrame for more reliable measurement
    animationFrames.current[index] = requestAnimationFrame(() => {
      // Check if target is still valid before measuring
      if (target && target.measureInWindow) {
        target.measureInWindow(
          (
            pageX: number,
            pageY: number,
            measureWidth: number,
            measureHeight: number,
          ) => {
            onLayout(index, {
              x: pageX,
              y: pageY,
              width: measureWidth,
              height: measureHeight,
            });
          },
        );
      }
      // Clean up the animation frame reference
      delete animationFrames.current[index];
    });
  };

  return (
    <View key={zone.id} style={styles.matchRow}>
      {/* Left side - fixed text */}
      <View style={styles.leftItem}>
        <Text style={styles.leftText}>{zone.leftText}</Text>
      </View>

      {/* Right side - drop zone */}
      <TouchableOpacity
        style={[
          styles.dropZone,
          zone.droppedItem && styles.filledDropZone,
          isAnswered &&
            zone.droppedItem?.text === zone.rightText &&
            styles.correctDropZone,
          isAnswered &&
            zone.droppedItem &&
            zone.droppedItem.text !== zone.rightText &&
            styles.incorrectDropZone,
        ]}
        onLayout={handleLayout}
        disabled={isAnswered}
      >
        {zone.droppedItem ? (
          <TouchableOpacity
            onPress={() => onRemoveFromDropZone(index)}
            disabled={isAnswered}
            style={styles.droppedTextContainer}
          >
            <Text style={styles.droppedText}>{zone.droppedItem.text}</Text>
            <Ionicons
              name="close-circle"
              size={scale(20)}
              color={Colors.red}
              style={[
                styles.closeIcon,
                i18n.language === 'ar'
                  ? styles.closeIconRtl
                  : styles.closeIconLtr,
              ]}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              {t('exercise.matchPairs.dragHere')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    paddingHorizontal: scale(8),
  },
  leftItem: {
    flex: 1,
    backgroundColor: Colors.lightBlue,
    padding: scale(12),
    borderRadius: scale(8),
    marginRight: scale(12),
  },
  leftText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.dark,
    textAlign: 'center',
  },
  dropZone: {
    flex: 1,
    minHeight: scale(48),
    borderWidth: 2,
    borderColor: Colors.lightBorder,
    borderStyle: 'dashed',
    borderRadius: scale(8),
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(8),
  },
  filledDropZone: {
    backgroundColor: Colors.lightBlue,
    borderColor: Colors.primary,
    borderStyle: 'solid',
  },
  correctDropZone: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
  },
  incorrectDropZone: {
    backgroundColor: Colors.lightRed,
    borderColor: Colors.red,
  },
  droppedText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.dark,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: moderateScale(12),
    color: Colors.gray,
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  droppedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeIconLtr: {
    right: 0,
  },
  closeIconRtl: {
    left: 0,
  },
});

export { DropZoneComponent };
export type { DropZone };
