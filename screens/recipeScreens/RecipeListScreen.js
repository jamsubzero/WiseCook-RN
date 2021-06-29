import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, FlatList, Button} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {Picker} from '@react-native-picker/picker';

import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import {getAllSelectedIngredients} from '../../components/asyncStorage/selectedIngredients';
import RecipeItem from '../../components/RecipeItem';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';

const RecipeListScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState();
  const [selectedCuisine, setSelectedCuisine] = useState();

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

  const onSelectRecipeHandler = id => {
    props.navigation.navigate('ViewRecipe', {selectedRecipeId: id});
  };

  const renderRecipes = itemData => {
    return (
      <RecipeItem
        itemData={itemData}
        onSelectRecipe={onSelectRecipeHandler.bind(this, itemData.item.id)}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topControlsContainer}>
        <View style={{flexDirection: 'row'}}>
          <Picker
            mode="dialog"
            selectedValue={selectedMeal}
            onValueChange={(itemValue, itemIndex) => setSelectedMeal(itemValue)}
            dropdownIconColor={Colors.primaryColor}
            style={{color: Colors.primaryColor, width: '50%'}}>
            <Picker.Item
              color={Colors.primaryColor}
              label="All Meal Type"
              value="All"
            />
            <Picker.Item
              color={Colors.primaryColor}
              label="Breakfast"
              value="Breakfast"
            />
            <Picker.Item
              color={Colors.primaryColor}
              label="Lunch"
              value="Lunch"
            />
            <Picker.Item
              color={Colors.primaryColor}
              label="Dinner"
              value="Dinner"
            />
          </Picker>

          <Picker
            mode="dialog"
            selectedValue={selectedCuisine}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedCuisine(itemValue)
            }
            dropdownIconColor={Colors.primaryColor}
            style={{color: Colors.primaryColor, width: '50%'}}>
            <Picker.Item
              color={Colors.primaryColor}
              label="All Cuisine"
              value="All"
            />
            <Picker.Item
              color={Colors.primaryColor}
              label="Mediterranean"
              value="Mediterranean"
            />
            <Picker.Item
              color={Colors.primaryColor}
              label="Asian"
              value="Asian"
            />
            <Picker.Item
              color={Colors.primaryColor}
              label="French"
              value="French"
            />
          </Picker>
          {/* <Button title="A" /> */}
        </View>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={recipes}
          renderItem={renderRecipes}
          onRefresh={onRefreshHandler}
          refreshing={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  topControlsContainer: {
    backgroundColor: 'white',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 2,
    paddingTop: 2,
    elevation: 4,
  },
  listContainer: {
    width: '100%',
    marginTop: 5,
  },
});

export default RecipeListScreen;
