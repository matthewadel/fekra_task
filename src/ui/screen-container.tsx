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
import { s } from 'react-native-size-matters';

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
  const { height: HEIGHT } = useWindowDimensions();

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

const styles = StyleSheet.create({
  safeArea: {
    height: '100%',
    backgroundColor: Colors.lightBackground,
  },
  keyboardAvoidingView: {
    width: '100%',
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  childrenBase: {
    paddingHorizontal: s(16),
    alignItems: 'center',
    height: 'auto',
    flexGrow: 0,
  },
  childrenFullHeight: {
    height: '100%',
  },
});

export { ScreenContainer };
