import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import APIUrls from '../../constants/APIUrls';
import Colors from '../../constants/Colors';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import RecipeInfo from '../../components/RecipeInfo';

const RecipeViewerScreen = props => {
  const {selectedRecipeId} = props.route.params;
  const URL = APIUrls.RECIPE_DETAILS_URL + selectedRecipeId;
  const [isLoading, setIsLoading] = useState(true);
  const [recipe, setRecipe] = useState('');

  useEffect(() => {
    console.log(selectedRecipeId);
    getRecipeDetailsFromWiseCookApi();
  }, []);

  const getRecipeDetailsFromWiseCookApi = () => {
    return fetch(URL)
      .then(response => response.json())
      .then(json => {
        setRecipe(json);
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
              getRecipeDetailsFromWiseCookApi(URL);
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

  if (!recipe || recipe.length <= 0) {
    return <ConnectionErrorMessage />;
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.mealHeader}>
        <ImageBackground
          style={styles.recipeImage}
          source={{uri: recipe.imageUrl}}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {recipe.title}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.mealDetailContainer}>
        <RecipeInfo iconName="clock-outline" info={recipe.time} />
        <RecipeInfo iconName="bread-slice-outline" info={recipe.servings} />
      </View>

      {/* <View>
        <Text>Ingredients</Text>
      </View> */}
      <Text>Ingredients</Text>
      <View>
        {recipe.ingredients.map(ingredient => (
          <Text key={ingredient.id}>{ingredient.name}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  parent: {
    flex: 1,
    alignItems: 'center',
  },
  detailText: {
    color: Colors.primaryColor,
  },
  mealHeader: {
    height: '85%',
    flex: 1,
  },
  recipeImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  mealDetailContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    height: 22,
    alignItems: 'center',
    backgroundColor: '#ebe4e4',
  },
});

export default RecipeViewerScreen;
