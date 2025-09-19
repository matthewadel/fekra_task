import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';

import { handleRtl, Colors, LoadingScreen } from '@/ui';
import { useScreenDimensions } from '@/context';
import { Error } from './error';
import { IError } from '@/types';

export interface IScreenContainer extends IError {
  style?: ViewStyle | ViewStyle[];
  children: any;
  noDirectionChange?: boolean;
  loading?: boolean;
  showStyle?: boolean;
}

const ScreenContainer = (props: IScreenContainer) => {
  const { actualHeight, setActualHeight } = useScreenDimensions();
  const insets = useSafeAreaInsets();
  const { height: HEIGHT, width: WIDTH } = useWindowDimensions();
  const styles = createStyles(WIDTH);

  useEffect(() => {
    let statusBarHeight = StatusBar.currentHeight
      ? 2 * StatusBar.currentHeight
      : 0;
    if (!actualHeight) {
      setActualHeight(HEIGHT - (insets.top + statusBarHeight + insets.bottom));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualHeight]);

  let childrenStyle = [
    styles.childrenBase,
    styles.childrenFullHeight,
    handleRtl(props.style, props.noDirectionChange, props.showStyle),
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.white}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
      >
        {props.loading ? (
          <LoadingScreen style={styles.loadingScreen} />
        ) : (
          <ScrollView
            scrollEnabled={true}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={styles.scrollView}
            contentContainerStyle={childrenStyle}
            keyboardShouldPersistTaps="handled"
          >
            {props.error ? (
              <Error error={props.error} refetch={props.refetch} />
            ) : (
              props.children
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (WIDTH: number) =>
  StyleSheet.create({
    safeArea: {
      height: '100%' as const,
      backgroundColor: Colors.lightBackground,
    },
    keyboardAvoidingView: {
      width: '100%' as const,
      flex: 1,
    },
    loadingScreen: {
      flex: 1,
    },
    viewOnlyContainer: {
      width: '100%' as const,
      height: '100%' as const,
    },
    scrollView: {
      flexGrow: 1,
    },
    childrenBase: {
      paddingHorizontal: s(16),
      alignItems: 'center' as const,
      height: 'auto' as const,
      flexGrow: 0,
    },
    childrenFullHeight: {
      height: '100%' as const,
    },
    outScrollingContainer: {
      paddingHorizontal: s(20),
      marginBottom: vs(32),
      marginTop: vs(25),
    },
    overlayLoading: {
      height: '100%' as const,
      position: 'absolute' as const,
      width: WIDTH,
      zIndex: 200,
      backgroundColor: Colors.dark + '1A', // Adding opacity
    },
  });

export { ScreenContainer };
