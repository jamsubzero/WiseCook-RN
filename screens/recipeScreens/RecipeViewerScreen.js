import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from 'react-native';

import APIUrls from '../../constants/APIUrls';
import Colors from '../../constants/Colors';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';

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
    <View style={styles.screen}>
      {/* <ScrollView> */}
        <ImageBackground
          style={styles.container}
          source={{uri: recipe.imageUrl}}
        />
        <Text>{recipe.title}</Text>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
   height: 300
  },
});

export default RecipeViewerScreen;
