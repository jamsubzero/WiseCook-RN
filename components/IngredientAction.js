import React from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../constants/Colors';

const IngredientAction = props => {
  const isOnPantry = props.isOnPantry;
  const isSupported = props.isSupported;

  // TODO maybe it is possible that unsupported ings can be added to the shopping list,
      // but NOT ON the pantry, just apologize to the user if they try to add it 

  if (isSupported) {
    if (isOnPantry) {
      return (
        <FontAwesomeIcon
          name="check-circle"
          size={23}
          color={Colors.green}
        />
      );
    } else {
      return (
        <TouchableOpacity>
          <FontAwesome5Icon
            name="cart-plus"
            size={18}
            color='black'
          />
        </TouchableOpacity>
      );
    }
  } else {
    return null;
  }
};

export default IngredientAction;
