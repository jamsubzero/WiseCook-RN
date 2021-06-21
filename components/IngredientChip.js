import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../constants/Colors';
import {
  saveSelectedIngredients,
  getSelectedIngredients,
} from '../components/asyncStorage/selectedIngredients';

const IngredientChip = props => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    getSelectedIngredients(selectIngredientsFromStorage => {
      setSelectedIngredients(selectIngredientsFromStorage); // setting the initial
    });
  }, []);

  const onIngToggleHandler = () => {

    let ingList = selectedIngredients.slice(); //copy the state
    const selectedIngIndex = ingList.indexOf(props.id);
    if (selectedIngIndex >= 0) {
      ingList.splice(selectedIngIndex, 1);
    } else {
      ingList.push(props.id);
    }
    setSelectedIngredients(ingList); // save to state
    saveSelectedIngredients(ingList); // save to storage
  };

  if (selectedIngredients.includes(props.id)) {
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
