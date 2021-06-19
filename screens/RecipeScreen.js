import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const recipeScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>This is the recipe screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default recipeScreen;
