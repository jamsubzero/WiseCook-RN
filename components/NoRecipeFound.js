import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constants/Colors';

const NoRecipeFound = (props) => {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.infoText}>
        {props.message}
      </Text>
      <MaterialCommunityIcons name="head-question" size={25} color={Colors.primaryColor} />
    </View>
  )
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default NoRecipeFound;
