import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Colors from '../constants/Colors';
import {getAllSelectedIngredients} from './asyncStorage/selectedIngredients';
import RecipeIngredientItem from './RecipeIngredientItem';

const RecipeIngredientList = props => {
  const ingredients = props.ingredients;
  const searchHits = props.searchHits;
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  var ingHits = 0;
  ingredients.map(ingredient => {
      if(selectedRecipes.includes(ingredient.ingredientCode)){
          ingHits++;
      }
  })

  useEffect(() => {
    getAllSelectedIngredients(allSelectIngredientsFromStorage => {
      setSelectedRecipes(allSelectIngredientsFromStorage);
    });
  }, []);

  return (
    <View style={styles.ingredientContainer}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.ingredientTitle}>Ingredients</Text>
        <Text style={styles.hits}>
          You have {ingHits} of these in your pantry
        </Text>
      </View>

      {ingredients.map(ingredient => (
        <RecipeIngredientItem
          key={ingredient.id}
          ingredient={ingredient}
          isOnPantry={selectedRecipes.includes(ingredient.ingredientCode)}
        />
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
    alignContent: 'center',
    marginRight: 5,
    marginBottom: 8,
  },
  ingredientTitle: {
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  hits: {
    color: Colors.primaryColor,
    fontSize: 11

  },
});

export default RecipeIngredientList;
