import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { spacing } from '../../theme/spacing';

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History Screen</Text>
      <Text style={styles.subtitle}>This screen will be implemented next</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: lightColors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...textStyles.body,
    color: lightColors.textSecondary,
    textAlign: 'center',
  },
});

export default HistoryScreen;
