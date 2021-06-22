import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../constants/Colors';
import {
  saveSelectedIngredients,
  getSelectedIngredients,
} from '../components/asyncStorage/selectedIngredients';

const IngredientChip = props => {
  const [isSelected, setIsSelected] = useState();

  useEffect(() => {
    getSelectedIngredients(selectIngredientsFromStorage => {
      setIsSelected(selectIngredientsFromStorage.includes(props.id)); // setting the initial
    });
  });

  const onIngToggleHandler = () => {
    console.log('=> ' + props.id);
    getSelectedIngredients(selectIngredientsFromStorage => {
      const selectedIngIndex = selectIngredientsFromStorage.indexOf(props.id);
      if (selectedIngIndex >= 0) {
        selectIngredientsFromStorage.splice(selectedIngIndex, 1);
      } else {
        selectIngredientsFromStorage.push(props.id);
      }

      saveSelectedIngredients(selectIngredientsFromStorage);
    });

    setIsSelected(!isSelected);
  };

  if (isSelected) {
    return (
      <Chip
        title={props.title}
        onPress={onIngToggleHandler}
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
      onPress={onIngToggleHandler}
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
    backgroundColor: '#b0b0b0',
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
