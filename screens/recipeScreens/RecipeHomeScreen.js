import React from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import {Button} from 'react-native-elements/dist/buttons/Button';

import Colors from '../../constants/Colors';

const RecipeHomeScreen = props => {
  let TouchableCmp = TouchableOpacity;

  const onRecipeSearchHandler = () => {
    props.navigation.navigate('FindRecipes');
  };

  if (Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topControlsContainer}>
        <Text style={styles.topMessage}>Find recipes based on what you have in your pantry!</Text>
        <View style={styles.touchable}>
          <TouchableCmp onPress={onRecipeSearchHandler}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonLabel}>Go WiseCook</Text>
              <FontAwesome5Icon name="chevron-right" size={17} color="white" />
            </View>
          </TouchableCmp>
        </View>
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
    overflow: "hidden",
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
    paddingRight: 12
  },
  topMessage: {
    color: Colors.primaryColor
  }
});

export default RecipeHomeScreen;
