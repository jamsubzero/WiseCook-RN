import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../constants/Colors';

const IngredientAction = props => {
  const isOnPantry = props.isOnPantry;
  const isOnShoppingList = props.isOnShoppingList;
  const isSupported = props.isSupported;

  // TODO maybe it is possible that unsupported ings can be added to the shopping list,
  // but NOT ON the pantry, just apologize to the user if they try to add it to the pantry
  // when adding it from the shopping list screen

  const onToggleShoppingListHandler = () => {
    props.onToggleShoppingList();
  };

  if (isSupported) {
    if (isOnPantry) {
      return (
        <FontAwesomeIcon
          name="check-circle"
          size={20}
          color={Colors.green}
          style={styles.iconStyle}
        />
      );
    } else {
      if (isOnShoppingList) {
        return (
          <TouchableOpacity onPress={onToggleShoppingListHandler}>
            <FontAwesome5Icon
              name="cart-plus"
              size={16}
              color="green"
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={onToggleShoppingListHandler}>
            <FontAwesome5Icon
              name="cart-plus"
              size={16}
              color="black"
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        );
      }
    }
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  iconStyle: {
    marginRight: 8,
  },
});

export default IngredientAction;
