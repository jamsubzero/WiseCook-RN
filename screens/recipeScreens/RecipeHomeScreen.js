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

import {getSelectedIngredients} from '../../components/asyncStorage/selectedIngredients';
import PreviewSectionItem from './components/PreviewSectionItem';
import IngredientCategories from '../../constants/IngredientCategories';
import APIUrls from '../../constants/APIUrls';
import Colors from '../../constants/Colors';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import Preferences from '../../constants/Preferences';

const RecipeHomeScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [homeContents, setHomeContents] = useState([]);

  const mountedRef = useRef(true);

  useEffect(() => {
    getPreviewContents();
  }, []);

  const getPreviewContents = async () => {
    var previewIngs = [];

    const meatIngs = await getSelectedIngredients(IngredientCategories.MEAT);
    if (meatIngs.length > 0) {
      previewIngs.push(meatIngs.slice(0, Preferences.FEED_INGS_PER_CATEGORY));
    }

    const vegeIngs = await getSelectedIngredients(
      IngredientCategories.VEGETABLES,
    );
    if (vegeIngs.length > 0) {
      previewIngs.push(vegeIngs.slice(0, Preferences.FEED_INGS_PER_CATEGORY));
    }

    const fishIngs = await getSelectedIngredients(IngredientCategories.FISH);
    if (fishIngs.length > 0) {
      previewIngs.push(fishIngs.slice(0, Preferences.FEED_INGS_PER_CATEGORY));
    }

    const dairyIngs = await getSelectedIngredients(IngredientCategories.DAIRY);
    if (dairyIngs.length > 0) {
      previewIngs.push(dairyIngs.slice(0, Preferences.FEED_INGS_PER_CATEGORY));
    }

    var URL = `${APIUrls.HOME_CONTENT_URL}${previewIngs.toString()}`;

    getRecipeByIngredientsFromWiseCookApi(URL);
  };

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
    return (
      <PreviewSectionItem
        preview={itemData.item}
        navigation={props.navigation}
      />
    );
  };

  const onRefreshHandler = () => {
    setHomeContents([]);
    setIsLoading(true);
    getPreviewContents();
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
      <Text style={styles.tipMessage}>
        Wise tip: Pull down to refresh the recipe feed.
      </Text>

      <View style={styles.listContainer}>
        <FlatList
          data={homeContents.previews}
          keyExtractor={item => item.ingredientId}
          renderItem={renderPreviews}
          refreshing={isLoading}
          onRefresh={onRefreshHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  topControlsContainer: {
    backgroundColor: 'white',
    height: 85,
    width: '100%',
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
  tipMessage: {
    color: Colors.primaryColor,
    fontWeight: '200',
    fontSize: 10,
    marginBottom: 3,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
});

export default RecipeHomeScreen;
