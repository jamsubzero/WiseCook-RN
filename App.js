import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import StackNavigator from './navigation/StackNavigator';

const App = () => {
  return (
    <View style={styles.screen}>
     <StackNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default App;
