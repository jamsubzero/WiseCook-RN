import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import Colors from '../constants/Colors';
import APIUrls from '../constants/APIUrls';
import {getAllSelectedIngredients} from '../components/asyncStorage/selectedIngredients';
import RecipeItem from '../components/RecipeItem';

const RecipeScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getAllSelectedIngredients(allSelectIngredientsFromStorage => {
      const selectIngsStr = allSelectIngredientsFromStorage.toString();
      const URL = APIUrls.RECIPE_BY_INGREDIENT_URL + selectIngsStr;
      getRecipeByIngredientsFromWiseCookApi(URL);
    });
  }, []);

  const getRecipeByIngredientsFromWiseCookApi = URL => {
    return fetch(URL)
      .then(response => response.json())
      .then(json => {
        setRecipes(json);
      })
      .catch(error => {
        console.log(error);
        Snackbar.show({
          text: 'Please check your internet connection',
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            text: 'Retry',
            textColor: Colors.primaryColor,
            onPress: () => {
              setIsLoading(true);
              getRecipeByIngredientsFromWiseCookApi();
            },
          },
        });
      })
      .finally(() => setIsLoading(false));
  };

  if (isLoading) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  const onSelectRecipeHandler = (id) => {
    console.log("selected: " + id);
  }

  const renderRecipes = itemData => {
    return (
      <RecipeItem itemData = {itemData} onSelectRecipe={onSelectRecipeHandler.bind(this, itemData.item.id)}/>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList data={recipes} renderItem={renderRecipes} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default RecipeScreen;
