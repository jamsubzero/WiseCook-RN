import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Button,
  Text,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {Picker} from '@react-native-picker/picker';

import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import {getAllSelectedIngredients} from '../../components/asyncStorage/selectedIngredients';
import RecipeItem from '../../components/RecipeItem';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import FilterItems from '../../constants/FilterItems';
import NoRecipeFound from '../../components/NoRecipeFound';

const MainRecipeListScreen = props => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(0);
  const [selectedCuisine, setSelectedCuisine] = useState(0);

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
        setIsError(true);
        Snackbar.show({
          text: 'Please check your internet connection',
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            text: 'Retry',
            textColor: Colors.primaryColor,
            onPress: () => {
              setIsLoading(true);
              setIsError(false);
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

  if (isError) {
    return <ConnectionErrorMessage />;
  }

  const onRefreshHandler = () => {
    filterRecipes(selectedMeal, selectedCuisine);
  };

  const onMealFilter = (mealValue, itemIndex) => {
    setSelectedMeal(mealValue);
    filterRecipes(mealValue, selectedCuisine);
  };

  const onCuisineFilter = (cuisineValue, itemIndex) => {
    setSelectedCuisine(cuisineValue);
    filterRecipes(selectedMeal, cuisineValue);
  };

  const filterRecipes = (meal, cuisine) => {
    var filters = [];
    if (meal != 0) {
      filters.push(FilterItems.MEALS[meal]);
    }

    if (cuisine != 0) {
      filters.push(FilterItems.CUISINES[cuisine]);
    }

    const filtersStr = filters.toString();
    console.log(meal + ', ' + cuisine);
    console.log(filters);

    setRecipes([]);
    setIsLoading(true);

    getAllSelectedIngredients().then(allSelectIngredientsFromStorage => {
      const selectIngsStr = allSelectIngredientsFromStorage.toString();
      const URL = `${APIUrls.RECIPE_SEARCH_WITH_FILTER_URL}${selectIngsStr}&keywords=${filtersStr}`;
      console.log(URL);
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
            selectedValue={selectedMeal}
            onValueChange={onMealFilter}
            dropdownIconColor={Colors.primaryColor}
            style={styles.picker}
            mode="dialog">
            {FilterItems.MEALS.map((item, index) => {
              return (
                <Picker.Item
                  label={item}
                  value={index}
                  key={index}
                  color={Colors.primaryColor}
                />
              );
            })}
          </Picker>

          <Picker
            selectedValue={selectedCuisine}
            onValueChange={onCuisineFilter}
            dropdownIconColor={Colors.primaryColor}
            style={styles.picker}
            mode="dialog">
            {FilterItems.CUISINES.map((item, index) => {
              return (
                <Picker.Item
                  label={item}
                  value={index}
                  key={index}
                  color={Colors.primaryColor}
                />
              );
            })}
          </Picker>
        </View>
      </View>

      {recipes.length > 0 ? (
        <View style={styles.listContainer}>
          <Text style={styles.tipMessage}>
            Wise tip: Pull down to refresh the recipe feed.
          </Text>

          <FlatList
            style={styles.flatList}
            data={recipes}
            renderItem={renderRecipes}
            onRefresh={onRefreshHandler}
            refreshing={isLoading}
          />
        </View>
      ) : (
        <NoRecipeFound />
      )}
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
  picker: {
    color: Colors.primaryColor,
    width: '50%',
  },
  flatList: {
    width: '100%',
  },
  listContainer: {
    width: '100%',
    marginTop: 1,
    alignItems: 'center',
  },
  tipMessage: {
    color: Colors.primaryColor,
    fontWeight: '200',
    fontSize: 10,
    marginBottom: 1,
  },
});

export default MainRecipeListScreen;
