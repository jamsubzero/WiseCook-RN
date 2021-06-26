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

  const onScrollHandler = event => {
    if (event.nativeEvent.contentOffset.y > 300) {
      props.navigation.setOptions({
        headerTransparent: false,
      });
    } else {
      props.navigation.setOptions({
        headerTransparent: true,
      });
    }
  };

  return (
    <ScrollView style={styles.screen} onScroll={onScrollHandler}>
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

      <View style={styles.ingredientContainer}>
        <Text style={styles.ingredientTitle}>Ingredients</Text>
        {recipe.ingredients.map(ingredient => (
          <View key={ingredient.id} style={styles.ingredientRowContainer}>
            <Text style={styles.ingredientEntry}>
              <Text style={{fontWeight: 'bold'}}>{ingredient.quantity}</Text>
              <Text>{ingredient.quantity.length > 0 ? ' ' : ''}</Text>
              <Text>{ingredient.name}</Text>
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.ingredientContainer}>
        <Text style={styles.ingredientTitle}>Steps</Text>
        {recipe.instructions.map(instruction => (
          <View key={instruction.id} style={styles.ingredientRowContainer}>
            {/* <Text
              style={{
                textAlign: 'center',
                backgroundColor: 'green',
                fontSize: 10 - 2 * 5, //... One for top and one for bottom alignment
                lineHeight: 5 - ( 2 * 5), //... One for top and one for bottom alignment
              }}>
              1
            </Text> */}
            <Text style={styles.ingredientEntry}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  borderRadius: 18 / 2,
                  backgroundColor: Colors.primaryColor,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: 12,
                  }}>
                  {instruction.step}
                </Text>
              </View>
              <Text>{'  '}</Text>
              <Text>{instruction.ins}</Text>
            </Text>
          </View>
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
  ingredientContainer: {
    marginHorizontal: 10,
    marginTop: 8,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.gray,
    paddingBottom: 20,
    marginBottom: 10,
  },
  ingredientTitle: {
    marginBottom: 10,
    fontSize: 16,
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
  stepNumContainer: {
    alignContent: 'center',
    backgroundColor: Colors.primaryColor,
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  stepNum: {
    color: 'white',
  },
});

export default RecipeViewerScreen;
