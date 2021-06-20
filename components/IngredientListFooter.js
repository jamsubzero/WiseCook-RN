import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Colors from '../constants/Colors';

export default class IngredientListFooter extends PureComponent {
  render() {
    return (
      <View style={styles.endOfIngContainer}>
        <Text style={styles.endOfIngMessage}>
          That's all the ingredients we have for now.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  endOfIngContainer: {
    width: '100%',
    height: 55,
    backgroundColor: Colors.primaryColor,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endOfIngMessage: {
    color: 'white',
  },
});
