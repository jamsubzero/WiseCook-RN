import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

import Colors from '../constants/Colors';

const ConnectionErrorMessage = () => {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.infoText}>
        Oh no! Something's really wrong here. {'\n'}
        If it's not you, perhaps WiseCook is down at the moment. {'\n'}
        Please try again later. {'\n'}
      </Text>
      <Icon
        name="coffee-off"
        size={24}
        color={Colors.primaryColor}
        type="material-community"
      />
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

export default ConnectionErrorMessage;
