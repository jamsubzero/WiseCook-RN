import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ToastAndroid} from 'react-native';

import Colors from '../constants/Colors';
import {
  getAllSelectedIngredients,
  getShoppingList,
  saveShoppingList,
} from './asyncStorage/selectedIngredients';
import RecipeIngredientItem from './RecipeIngredientItem';

const RecipeIngredientList = props => {
  const ingredients = props.ingredients;
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  var ingHits = 0;
  ingredients.map(ingredient => {
    if (selectedRecipes.includes(ingredient.ingredientCode)) {
      ingHits++;
    }
  });

  useEffect(() => {
    getIngredientStatusOnStorage();
  }, []);

  const getIngredientStatusOnStorage = async () => {
    var allSelectIngredientsFromStorage = await getAllSelectedIngredients();
    var shoppingListFromStorage = await getShoppingList();

    setSelectedRecipes(allSelectIngredientsFromStorage);
    setShoppingList(shoppingListFromStorage);
  };

  const onToggleShoppingListHandler = async (id, ingCategory) => {
    var shoppingListFromStorage = await getShoppingList();

    const selectedIngIndex = shoppingListFromStorage.findIndex(ing => ing.id === id);
    if (selectedIngIndex < 0) {
      shoppingListFromStorage.push({id: id, category: ingCategory, isChecked: false});
      ToastAndroid.show(`Added to your shopping list`, ToastAndroid.SHORT);
    } else {
      shoppingListFromStorage.splice(selectedIngIndex, 1);
      ToastAndroid.show(`Excluded from your shopping list`, ToastAndroid.SHORT);
    }
    await saveShoppingList(shoppingListFromStorage);
    setShoppingList(shoppingListFromStorage);
  };

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
          isOnShoppingList={shoppingList.findIndex(ing => ing.id === ingredient.ingredientCode) >= 0}
          ingCode={ingredient.ingredientCode}
          ingCategory={ingredient.ingredientCategory}
          onToggleShoppingList={onToggleShoppingListHandler}
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
    fontSize: 11,
  },
});

export default RecipeIngredientList;
