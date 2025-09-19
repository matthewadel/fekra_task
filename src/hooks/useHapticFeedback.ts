import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

type HapticType =
  | 'success'
  | 'error'
  | 'warning'
  | 'light'
  | 'medium'
  | 'heavy';

/**
 * Custom hook for consistent haptic feedback across the app
 */
export const useHapticFeedback = () => {
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerHaptic = (type: HapticType) => {
    try {
      switch (type) {
        case 'success':
          ReactNativeHapticFeedback.trigger(
            'notificationSuccess',
            hapticOptions,
          );
          break;
        case 'error':
          ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
          break;
        case 'warning':
          ReactNativeHapticFeedback.trigger(
            'notificationWarning',
            hapticOptions,
          );
          break;
        case 'light':
          ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
          break;
        case 'medium':
          ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
          break;
        case 'heavy':
          ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
          break;
        default:
          ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
      }
    } catch (error) {
      // Silently fail if haptics are not supported
      console.warn('Haptic feedback not supported:', error);
    }
  };

  return { triggerHaptic };
};
