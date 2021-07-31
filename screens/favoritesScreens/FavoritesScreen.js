import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Image,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {useIsFocused} from '@react-navigation/native';

import {getHeartedRecipes} from '../../components/asyncStorage/selectedIngredients';
import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import NoRecipeFound from '../../components/NoRecipeFound';
import RecipeItem from '../../components/RecipeItem';
import {set} from 'react-native-reanimated';

const FavoritesScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [heartedListFromStorage, setHeartedListFromStorage] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    updateHeartedListFromStorage();
  }, [isFocused]);

  useEffect(() => {
    retrieveHeartedList();
  }, [heartedListFromStorage]);

  const getFavoritesFromWiseCookApi = URL => {
    console.log('getting from wisecook');
    return fetch(URL)
      .then(response => response.json())
      .then(json => {
        setFavorites(json);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
        Snackbar.show({
          text: 'Please check your internet connection',
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            text: 'Retry',
            textColor: Colors.primaryColor,
            onPress: () => {
              setIsLoading(true);
              getFavoritesFromWiseCookApi(URL);
            },
          },
        });
      })
      .finally(() => setIsLoading(false));
  };

  const retrieveHeartedList = async () => {
    if (heartedListFromStorage.length <= 0) {
      console.log('No favorites yet');
      return;
    }
    setIsLoading(true);
    var URL = `${APIUrls.FAVORITES_URL}${heartedListFromStorage.toString()}`;

    getFavoritesFromWiseCookApi(URL);
  };

  const updateHeartedListFromStorage = async () => {
    var listFromStorage = await getHeartedRecipes();
    if (listFromStorage.length !== heartedListFromStorage.length) {
      setHeartedListFromStorage(listFromStorage);
    }
  };

  if (!favorites || favorites.length <= 0) {
    return (
      <NoRecipeFound
        message={`You currently don't have favorite recipes.
Add some by hearting a recipe.`}
      />
    );
  }

  if (isLoading) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  const onRefreshHandler = () => {
    setFavorites([]);
    setIsLoading(true);
    retrieveHeartedList();
  };

  const onSelectRecipeHandler = id => {
    props.navigation.navigate('ViewRecipe', {selectedRecipeId: id});
  };

  const renderFavoriteList = itemData => {
    return (
      <RecipeItem
        itemData={itemData}
        onSelectRecipe={onSelectRecipeHandler.bind(this, itemData.item.id)}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        keyExtractor={item => item.id}
        data={favorites}
        onRefresh={onRefreshHandler}
        refreshing={isLoading}
        renderItem={renderFavoriteList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cardStyle: {
    flexDirection: 'row',
    marginHorizontal: 4,
    marginVertical: 2,
    paddingRight: 5,
    padding: 0,
    height: 80,
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: 90,
  },
  recipeTitleStyle: {
    fontSize: 16,
    color: Colors.gray,
    marginHorizontal: 5,
    width: '80%',
  },
});

export default FavoritesScreen;
