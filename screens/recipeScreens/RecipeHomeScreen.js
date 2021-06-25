import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

const RecipeHomeScreen = (props) => {

  const onRecipeSearchHandler = () => {
    props.navigation.navigate("FindRecipes");
  }

  return (
    <View style={styles.screen}>
      <Text>Welcome to WiseCook Recipe Home screen</Text>
      <Button title="Recipe By Ingredients" onPress={onRecipeSearchHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  }

});

export default RecipeHomeScreen;