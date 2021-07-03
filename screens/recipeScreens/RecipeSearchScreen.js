import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, FlatList, Text} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FAB, Overlay} from 'react-native-elements';

import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import RecipeItem from '../../components/RecipeItem';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import SearchRecipe from './components/SearchRecipe';
import NoRecipeFound from '../../components/NoRecipeFound';

const RecipeSearchScreen = props => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState(props.route.params.keyword);

  useEffect(() => {
    const URL = APIUrls.RECIPE_SEARCH_BY_NAME_URL + keyword;
    getRecipeByIngredientsFromWiseCookApi(URL);
  }, [keyword]);

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

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const onSearchHandler = searchKey => {
    toggleOverlay();
    if (searchKey.length > 0) {
      setIsLoading(true);
      setRecipes([]);
      setKeyword(searchKey);
    }
  };

  if (recipes.length <= 0) {
    return (
      <View style={styles.screen}>
        <NoRecipeFound
          message={`Sorry, no results found for '${keyword}'.

          Rest assured, my creator is adding new recipes
          everyday so I can get even more wiser.`}
        />
        <Overlay
          overlayStyle={styles.searchStyle}
          isVisible={visible}
          onBackdropPress={toggleOverlay}>
          <SearchRecipe onSearch={onSearchHandler} />
        </Overlay>

        <FAB
          onPress={toggleOverlay}
          placement="right"
          style={{bottom: 8}}
          color={Colors.blue}
          containerStyle={{elevation: 25}}
          size="large"
          icon={<Ionicons name="search" size={25} color="white" />}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.listContainer}>
        <Text style={styles.searchResultLabel}>{`Search results for '${keyword}'`}</Text>
        <FlatList
          style={styles.flatList}
          data={recipes}
          renderItem={renderRecipes}
        />
      </View>

      <Overlay
        overlayStyle={styles.searchStyle}
        isVisible={visible}
        onBackdropPress={toggleOverlay}>
        <SearchRecipe onSearch={onSearchHandler} />
      </Overlay>

      <FAB
        onPress={toggleOverlay}
        placement="right"
        style={{bottom: 8}}
        color={Colors.blue}
        containerStyle={{elevation: 25}}
        size="large"
        icon={<Ionicons name="search" size={25} color="white" />}
      />
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
    marginTop: 5
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
  searchStyle: {
    padding: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  searchResultLabel: {
    color: Colors.gray
  }
});

export default RecipeSearchScreen;
