import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const PantryScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>Welcome to the pantry screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default PantryScreen;
