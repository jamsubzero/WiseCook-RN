import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import Card from '../components/Card';
import Colors from '../constants/Colors';
import APIUrls from '../constants/APIUrls';
import {getAllSelectedIngredients} from '../components/asyncStorage/selectedIngredients';

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

  const renderRecipes = itemData => {
    return (
      <Card style={styles.cardStyle}>
        <View style={styles.recipeItemContainer}>
          <Image source={{uri: itemData.item.imageUrl}} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>
              {itemData.item.title}
            </Text>
            <Text>
              hits: {itemData.item.hits}
            </Text>
            <Text>
             servings: {itemData.item.servings}
            </Text>
            <Text>
            time:  {itemData.item.time}
            </Text>
          </View>
        </View>
      </Card>
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
  cardStyle: {
    marginHorizontal: 8,
    marginVertical: 5,
    padding: 0,
    height: 150,
    overflow: 'hidden'
  },
  recipeItemContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    width: '40%',
    height: 150,
  },
  infoContainer: {
    flex: 1,
    margin: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  title: {
    flexWrap: 'wrap',
  },
});

export default RecipeScreen;
