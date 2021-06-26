import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Colors from '../constants/Colors';

const RecipeIngredientList = props => {
  const ingredients = props.ingredients;
  const searchHits = props.searchHits;
  return (
    <View style={styles.ingredientContainer}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.ingredientTitle}>Ingredients</Text>
        <Text>{searchHits}</Text>
      </View>

      {ingredients.map(ingredient => (
        <View key={ingredient.id} style={styles.ingredientRowContainer}>
          <Text style={styles.ingredientEntry}>
            <Text style={{fontWeight: 'bold'}}>{ingredient.quantity}</Text>
            <Text>{ingredient.quantity.length > 0 ? ' ' : ''}</Text>
            <Text>{ingredient.name}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ingredientContainer: {
    marginHorizontal: 10,
    marginTop: 8,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.gray,
    paddingBottom: 20,
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 5
  },
  ingredientTitle: {
    color: Colors.primaryColor,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  ingredientRowContainer: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderColor: Colors.gray,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 0,
    borderTopWidth: 0.2,
  },
});

export default RecipeIngredientList;
