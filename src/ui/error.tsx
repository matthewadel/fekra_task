import React from 'react';
import { View, Text, TouchableOpacity, Colors } from '@/ui';
import { IError } from '@/types';
import { s, vs } from 'react-native-size-matters';
import { StyleSheet } from 'react-native';

const Error = ({ error, refetch }: IError) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export { Error };

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: 'center',
    padding: s(20),
    backgroundColor: '#FFF5F5',
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  errorText: {
    fontSize: s(14),
    color: '#E53E3E',
    marginBottom: vs(12),
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: vs(8),
    paddingHorizontal: s(16),
    borderRadius: s(6),
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: s(12),
    fontWeight: '600',
  },
});
