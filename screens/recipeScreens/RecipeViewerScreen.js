import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const RecipeViewerScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>Welcome to RecipeViewer</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
  }

});

export default RecipeViewerScreen;