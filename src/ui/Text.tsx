import React from 'react';
import { Platform, StyleSheet, Text as RNText, TextStyle } from 'react-native';
import { s } from 'react-native-size-matters';

import { Colors } from './colors';
import i18n from '@/i18n';
import { FONT_FAMILY } from '@/types/ui/fonts';
import { IText } from '@/types';

const Text = (props: IText) => {
  let defaultStyle = {
    fontSize: s(16),
    color: Colors.dark,
    textShadowOffset: { width: 0, height: 0 },
    fontFamily: FONT_FAMILY(),
  };

  let textAlignmentStyle: TextStyle = props.noDirectionChange
    ? {}
    : { textAlign: i18n.language === 'ar' ? 'right' : 'left' };

  let textWeightStyle: TextStyle =
    StyleSheet.flatten(props.style)?.fontWeight === 'bold'
      ? {
          fontFamily: FONT_FAMILY('BOLD'),
          fontWeight: Platform.OS === 'android' ? 'normal' : 'bold',
        }
      : {};

  return (
    <RNText
      allowFontScaling={false}
      {...props}
      onPress={props.disabled ? () => null : props.onPress}
      style={[
        defaultStyle,
        textAlignmentStyle,
        StyleSheet.flatten(props.style),
        textWeightStyle,
      ]}
    />
  );
};

export { Text };
