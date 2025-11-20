import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Tools() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tools</Text>
      <Text style={styles.subtext}>This section is currently being updated.</Text>
      <Text style={styles.subtext}>Stay tuned for future improvements!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
