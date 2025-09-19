import React from 'react';
import { Colors, TouchableOpacity } from '@/ui';
import { StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { ITouchableOpacity } from '../types/ui/itouchable-opacity';

const Button: React.FC<ITouchableOpacity> = props => {
  return (
    <TouchableOpacity
      {...props}
      textStyle={[styles.startButtonText, props.textStyle]}
      style={[styles.startButton, props.style]}
    />
  );
};

export { Button };

const styles = StyleSheet.create({
  startButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: vs(10),
    borderRadius: s(25),
    alignItems: 'center',
    shadowColor: Colors.primary,
    marginBottom: vs(24),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: s(8),
    elevation: 8,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: s(18),
  },
});
