import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, FlatList} from 'react-native';
import Snackbar from 'react-native-snackbar';

import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import {getAllSelectedIngredients} from '../../components/asyncStorage/selectedIngredients';
import RecipeItem from '../../components/RecipeItem';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';

const RecipeListScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getAllSelectedIngredients().then(allSelectIngredientsFromStorage => {
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
              getRecipeByIngredientsFromWiseCookApi(URL);
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

  if (!recipes || recipes.length <= 0) {
    return <ConnectionErrorMessage />;
  }

  const onRefreshHandler = () => {
    setRecipes([]);
    setIsLoading(true);
    getAllSelectedIngredients().then(allSelectIngredientsFromStorage => {
      const selectIngsStr = allSelectIngredientsFromStorage.toString();
      const URL = APIUrls.RECIPE_BY_INGREDIENT_URL + selectIngsStr;
      getRecipeByIngredientsFromWiseCookApi(URL);
    });
  };

  const onSelectRecipeHandler = (id, hits) => {
    props.navigation.navigate('ViewRecipe', {selectedRecipeId: id});
  };

  const renderRecipes = itemData => {
    return (
      <RecipeItem
        itemData={itemData}
        onSelectRecipe={onSelectRecipeHandler.bind(
          this,
          itemData.item.id,
          itemData.item.hits,
        )}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={recipes}
        renderItem={renderRecipes}
        onRefresh={onRefreshHandler}
        refreshing={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default RecipeListScreen;
