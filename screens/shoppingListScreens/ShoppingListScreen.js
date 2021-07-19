import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {
  getShoppingList,
  saveShoppingList,
} from '../../components/asyncStorage/selectedIngredients';
import APIUrls from '../../constants/APIUrls';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import Colors from '../../constants/Colors';
import {titleCase} from '../../utils/StringUtil';

const ShoppingListScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]); // array of ingredientCategories
  const [shoppingList, setShoppingList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getShoppingList().then(shoppingListFromStorage => {
      setShoppingList(shoppingListFromStorage);
      console.log(shoppingListFromStorage);
    });
  }, [isFocused]);

  useEffect(() => {
    getIngredientsFromWiseCookApi();
  }, []);

  const getIngredientsFromWiseCookApi = () => {
    return fetch(APIUrls.INGREDIENT_LIST_URL)
      .then(response => response.json())
      .then(json => {
        extractIngredients(json);
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
              getIngredientsFromWiseCookApi();
            },
          },
        });
      });
  };

  const extractIngredients = json => {
    var ingCodes = [];
    for (const ingCategory of json) {
      ingCodes.push(...ingCategory.ingredientCodes);
    }

    setIngredients(ingCodes);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  if (!ingredients || ingredients.length <= 0) {
    return <ConnectionErrorMessage />;
  }

  const onRefreshHandler = () => {
    setIngredients([]);
    setIsLoading(true);
    getIngredientsFromWiseCookApi();
  };

  const renderShoppingList = itemData => {
    const ingredient = ingredients.find(ing => ing.id === itemData.item.id);
    if (!ingredient) {
      return null;
    }
    const isChecked = itemData.item.isChecked;
    const ingTextColor = isChecked ? Colors.green : Colors.primaryColor;
    return (
      <View style={styles.ingredientRowContainer}>
        <View style={styles.deleteIconContainer}>
          <TouchableOpacity>
            <EvilIcons name="minus" size={21} color={Colors.lightRed} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <View style={styles.ingredientContainer}>
            <Text style={{color: ingTextColor, width: '95%'}}>
              {titleCase(ingredient.name)}
            </Text>
            {isChecked ? (
              <MaterialIcons name="check-box" size={19} color={Colors.green} />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                size={19}
                color={Colors.gray}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.flatListContainer}>
        <FlatList
          keyExtractor={item => item.id}
          style={styles.flatList}
          data={shoppingList}
          renderItem={renderShoppingList}
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
  },
  flatList: {
    flex: 1,
    marginTop: 5,
  },
  flatListContainer: {
    flex: 1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  ingredientRowContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.gray,
  },
  deleteIconContainer: {
    flexDirection: 'row',
    width: '5%',
    alignItems: 'center',
  },
  ingredientContainer: {
    flexDirection: 'row',
    marginLeft: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    width: '90%',
  },
});

export default ShoppingListScreen;
