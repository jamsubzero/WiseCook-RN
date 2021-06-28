import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  FlatList,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import {
  getSelectedIngredients,
  getMultipleSelectedIngs,
} from '../../components/asyncStorage/selectedIngredients';
import PreviewSectionItem from './components/PreviewSectionItem';
import IngredientCategories from '../../constants/IngredientCategories';
import APIUrls from '../../constants/APIUrls';
import Colors from '../../constants/Colors';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';

const RecipeHomeScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [homeContents, setHomeContents] = useState('');

  const mountedRef = useRef(true);

  useEffect(() => {
    const favKeys = [
      '@selected_ing_' + IngredientCategories.MEAT, // Check meat first
      '@selected_ing_' + IngredientCategories.VEGETABLES,
      '@selected_ing_' + IngredientCategories.FISH,
      '@selected_ing_' + IngredientCategories.DAIRY,
    ];
    getMultipleSelectedIngs(favKeys, selectedIngs => {
      console.log(selectedIngs);

      var URL = APIUrls.HOME_CONTENT_URL;

      if (selectedIngs.length > 0) {
        URL = `${URL}/${selectedIngs[0]}`;
        if (selectedIngs.length > 1) {
          URL = `${URL}/${selectedIngs[1]}`;
        }
      }

      getRecipeByIngredientsFromWiseCookApi(URL);
    });
  }, []);

  const getRecipeByIngredientsFromWiseCookApi = URL => {
    console.log(URL);
    return fetch(URL)
      .then(response => response.json())
      .then(json => {
        setHomeContents(json);
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

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  let TouchableCmp = TouchableOpacity;
  if (Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const onRecipeSearchHandler = () => {
    props.navigation.navigate('FindRecipes');
  };

  if (isLoading) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  if (!homeContents || homeContents.length <= 0) {
    return <ConnectionErrorMessage />;
  }

  const renderPreviews = itemData => {
    return <PreviewSectionItem preview={itemData.item} navigation={props.navigation}/>;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topControlsContainer}>
        <Text style={styles.topMessage}>
          Find recipes based on what you have in your pantry!
        </Text>
        <View style={styles.touchable}>
          <TouchableCmp onPress={onRecipeSearchHandler}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonLabel}>Go WiseCook</Text>
              <FontAwesome5Icon name="chevron-right" size={17} color="white" />
            </View>
          </TouchableCmp>
        </View>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={homeContents.previews}
          keyExtractor={item => item.ingredientId}
          renderItem={renderPreviews}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topControlsContainer: {
    backgroundColor: 'white',
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 2,
    paddingTop: 2,
    elevation: 4,
  },
  touchable: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    paddingVertical: 8,
    width: '97%',
    margin: 5,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 18,
    paddingRight: 12,
  },
  topMessage: {
    color: Colors.primaryColor,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
});

export default RecipeHomeScreen;
