import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';

const App = () => {
  return (
    <View style={styles.screen}>
     <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default App;
