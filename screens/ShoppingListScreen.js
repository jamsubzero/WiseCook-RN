import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const shoppingListScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>This is the shoppinglist screen</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
  }

});

export default shoppingListScreen;