import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import APIUrls from '../../constants/APIUrls';
import Colors from '../../constants/Colors';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import RecipeInfo from '../../components/RecipeInfo';
import RecipeIngredientList from '../../components/RecipeIngredientList';
import RecipeDirectionList from '../../components/RecipeDirectionList';
import {
  getHeartedRecipes,
  saveHeartedRecipes
} from '../../components/asyncStorage/selectedIngredients';
const RecipeViewerScreen = props => {
  const {selectedRecipeId} = props.route.params;
  const URL = APIUrls.RECIPE_DETAILS_URL + selectedRecipeId;
  const [isLoading, setIsLoading] = useState(true);
  const [recipe, setRecipe] = useState('');
  const [isHearted, setIsHearted] = useState(false);

  useEffect(() => {
    console.log(selectedRecipeId);
    getRecipeDetailsFromWiseCookApi();
  }, []);

  const getRecipeDetailsFromWiseCookApi = () => {
    return fetch(URL)
      .then(response => response.json())
      .then(json => {
        initializeRecipe(json);
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

  const initializeRecipe = async (json) => {
    var heartedListFromStorage = await getHeartedRecipes();
    const selectedRecIndex = heartedListFromStorage.findIndex(recId => recId === json.id);
    if (selectedRecIndex >= 0) {
      setIsHearted(true);
    }
    setRecipe(json);
  }

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

  const onToggleHearted = async () => {

    var heartedListFromStorage = await getHeartedRecipes();
    const selectedRecIndex = heartedListFromStorage.findIndex(recId => recId === recipe.id);

    if (selectedRecIndex < 0) {
      heartedListFromStorage.push(recipe.id);
      ToastAndroid.show(`Added to favorites`, ToastAndroid.SHORT);
    } else {
      heartedListFromStorage.splice(selectedRecIndex, 1);
      ToastAndroid.show(`Removed from favorites`, ToastAndroid.SHORT);
    }

    await saveHeartedRecipes(heartedListFromStorage);
    setIsHearted(!isHearted);
  }

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
            <TouchableOpacity onPress={onToggleHearted}>
              <FontAwesome
                name={isHearted ? "heart" : "heart-o"}
                size={25}
                color={isHearted ? Colors.primaryColor : "white"}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.mealDetailContainer}>
        <RecipeInfo iconName="clock-outline" info={recipe.time} />
        <RecipeInfo iconName="bread-slice-outline" info={recipe.servings} />
      </View>

      <RecipeIngredientList ingredients={recipe.ingredients} />

      <RecipeDirectionList directions={recipe.instructions} />
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
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 5,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
    textAlign: 'left',
    width: '90%',
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
