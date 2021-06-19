import React, {useState,} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../constants/Colors';

const IngredientChip = props => {

  const [isSelected, setIsSelected] = useState(false);
   
  const onToggleHandler = () => {
    // use props.id to check if it exists in asyncstorage
    setIsSelected(!isSelected);
  }

  if (isSelected) {
    return (
      <Chip
        title={props.title}
        onPress={onToggleHandler}
        containerStyle={styles.containerStyle}
        buttonStyle={styles.buttonSelectedStyle}
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
      onPress={onToggleHandler}
      containerStyle={styles.containerStyle}
      buttonStyle={styles.buttonNotSelectedStyle}
      titleStyle={styles.titleStyleNotSelected}
    />
  );
};

const styles = StyleSheet.create({
  buttonSelectedStyle: {
    backgroundColor: Colors.primaryColor,
  },
  buttonNotSelectedStyle: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.gray,
    overflow: 'hidden'
  },
  titleStyleNotSelected:{
      color: Colors.gray
  },
  containerStyle: {
    marginHorizontal: 3,
    marginVertical: 3,
    overflow: 'hidden'
  },
});

export default IngredientChip;
