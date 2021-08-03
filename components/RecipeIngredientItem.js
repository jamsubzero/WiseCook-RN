import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Colors from '../constants/Colors';
import IngredientAction from './IngredientAction';

const RecipeIngredientItem = props => {
  const isOnPantry = props.isOnPantry;
  const isOnShoppingList = props.isOnShoppingList;
  const ingredient = props.ingredient;
  const ingCode = props.ingCode;
  const isSupported = props.ingCode ? true : false;
  const textColor = isOnPantry ? Colors.green : 'black';

  const onToggleShoppingListHandler = () => {
    props.onToggleShoppingList(ingCode);
  };

  return (
    <View style={styles.ingredientRowContainer}>
      <Text style={{width: '90%', color: textColor}}>
        <Text style={styles.ingredientText}>{ingredient.quantity}</Text>
        <Text>{(ingredient.quantity && ingredient.quantity.length > 0) ? ' ' : ''}</Text>
        <Text>{ingredient.name}</Text>
      </Text>

      <IngredientAction
        isSupported={isSupported}
        isOnPantry={isOnPantry}
        isOnShoppingList={isOnShoppingList}
        onToggleShoppingList={onToggleShoppingListHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ingredientRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 10,
    borderColor: Colors.gray,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 0,
    borderTopWidth: 0.2,
  },
  ingredientText: {
    fontWeight: 'bold',
  },
});

export default RecipeIngredientItem;
