import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../constants/Colors';

const IngredientChip = props => {

  if (props.isSelected) {
    return (
      <Chip
        title={props.title}
        onPress={props.onToggleIngredient}
        containerStyle={styles.containerStyle}
        buttonStyle={styles.buttonSelectedStyle}
        titleStyle={styles.titleStyle}
        icon={{
          name: 'checkmark',
          type: 'ionicon',
          size: 16,
          color: 'white',
        }}
      />
    );
  }

  return (
    <Chip
      title={props.title}
      onPress={props.onToggleIngredient}
      containerStyle={styles.containerStyle}
      buttonStyle={styles.buttonNotSelectedStyle}
      titleStyle={styles.titleStyle}
    />
  );
};

const styles = StyleSheet.create({
  buttonSelectedStyle: {
    backgroundColor: Colors.primaryColor,
  },
  buttonNotSelectedStyle: {
    backgroundColor: Colors.gray,
  },
  titleStyle: {
    fontSize: 11,
  },
  containerStyle: {
    marginHorizontal: 3,
    marginVertical: 3,
    overflow: 'hidden',
  },
});

export default IngredientChip;
