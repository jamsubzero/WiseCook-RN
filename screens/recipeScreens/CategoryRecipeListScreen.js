import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, FlatList} from 'react-native';
import Snackbar from 'react-native-snackbar';

import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import RecipeItem from '../../components/RecipeItem';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import { titleCase } from '../../utils/StringUtil';

const CategoryRecipeListScreen = props => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const oneIngId = props.route.params.oneIngId;
  const ingName = props.route.params.oneIngName;

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: `${titleCase(ingName)} recipes`,
    });

    const URL = APIUrls.RECIPE_BY_INGREDIENT_URL + oneIngId;
    getRecipeByIngredientsFromWiseCookApi(URL);
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
      <View style={styles.listContainer}>
        <FlatList
          style={styles.flatList}
          data={recipes}
          renderItem={renderRecipes}
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
  picker: {
    color: Colors.primaryColor,
    width: '50%',
  },
  flatList: {
    width: '100%',
  },
  listContainer: {
    width: '100%',
    marginTop: 3,
    alignItems: 'center',
  },
  tipMessage: {
    color: Colors.primaryColor,
    fontWeight: '200',
    fontSize: 10,
    marginBottom: 1,
  },
});

export default CategoryRecipeListScreen;
