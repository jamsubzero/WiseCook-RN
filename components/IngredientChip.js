import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../constants/Colors';
import {
  saveSelectedIngredients,
  getSelectedIngredients,
} from '../components/asyncStorage/selectedIngredients';

const IngredientChip = props => {
  const [isSelected, setIsSelected] = useState();
  const mountedRef = useRef(true);

  useEffect(() => {
    getSelectedIngredients(props.catId).then(selectIngredientsFromStorage => {
      if (!mountedRef.current) {
        // so it will return if component is not mounted
        return null;
      }

      setIsSelected(selectIngredientsFromStorage.includes(props.id)); // setting the initial
    });
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onIngToggleHandler = () => {
    console.log('=> ' + props.id);
    getSelectedIngredients(props.catId).then(selectIngredientsFromStorage => {
      const selectedIngIndex = selectIngredientsFromStorage.indexOf(props.id);
      if (selectedIngIndex >= 0) {
        selectIngredientsFromStorage.splice(selectedIngIndex, 1);
      } else {
        selectIngredientsFromStorage.push(props.id);
      }

      saveSelectedIngredients(props.catId, selectIngredientsFromStorage);
    });

    props.onCountChange(isSelected ? -1 : 1);
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
    backgroundColor: Colors.lightGray,
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
