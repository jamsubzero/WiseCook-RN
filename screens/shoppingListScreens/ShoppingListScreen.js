import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
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
import NoRecipeFound from '../../components/NoRecipeFound';

const ShoppingListScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]); // array of ingredientCategories
  const [shoppingList, setShoppingList] = useState([]);
  const isFocused = useIsFocused();
  const [checkedCount, setCheckedCount] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    getShoppingList().then(shoppingListFromStorage => {
      var arranged = [];
      var allUnChecked = shoppingListFromStorage.filter(
        ing => ing.isChecked === false,
      );
      arranged.push(...allUnChecked);
      var allChecked = shoppingListFromStorage.filter(
        ing => ing.isChecked === true,
      );
      arranged.push(...allChecked);

      setCheckedCount(allChecked.length);
      setShoppingList(arranged);
      setIsAllChecked(allChecked.length === shoppingListFromStorage.length);
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

  if (!shoppingList || shoppingList.length <= 0) {
    return (
      <NoRecipeFound
        message={`Your shopping list is currently empty.
You can add some from 'My pantry' or from missing
ingredients in a recipe.`}
      />
    );
  }

  let TouchableCmp = TouchableOpacity;
  if (Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const onRefreshHandler = () => {
    setIngredients([]);
    setIsLoading(true);
    getIngredientsFromWiseCookApi();
  };

  const onToggleCheckHandler = async id => {
    var ingList = shoppingList.slice();
    const ingIndex = ingList.findIndex(ing => ing.id === id);
    ingList[ingIndex].isChecked = !ingList[ingIndex].isChecked;
    await saveShoppingList(ingList);

    var arranged = [];
    var allUnChecked = ingList.filter(ing => ing.isChecked === false);
    arranged.push(...allUnChecked);
    var allChecked = ingList.filter(ing => ing.isChecked === true);
    arranged.push(...allChecked);

    setIsAllChecked(allChecked.length === ingList.length);
    setCheckedCount(allChecked.length);
    setShoppingList(arranged);
  };

  const onDeleteIngInListHandler = async id => {
    var ingList = shoppingList.slice();
    const ingIndex = ingList.findIndex(ing => ing.id === id);
    ingList.splice(ingIndex, 1);
    await saveShoppingList(ingList);
    var allChecked = ingList.filter(ing => ing.isChecked === true);

    setCheckedCount(allChecked.length);
    setShoppingList(ingList);
  };

  const onCheckAllToggleHandler = async () => {
    var ingList = shoppingList.slice();
    for (var ing of ingList) {
      ing.isChecked = !isAllChecked;
    }

    await saveShoppingList(ingList);

    setShoppingList(ingList);
    setIsAllChecked(!isAllChecked);
    setCheckedCount(isAllChecked ? 0 : ingList.length);
  };

  const addToPantryHandler = () => {};

  const renderShoppingList = itemData => {
    const ingredient = ingredients.find(ing => ing.id === itemData.item.id);
    if (!ingredient) {
      return null;
    }
    const isChecked = itemData.item.isChecked;
    return (
      <View style={styles.ingredientRowContainer}>
        <View style={styles.deleteIconContainer}>
          <TouchableOpacity
            onPress={onDeleteIngInListHandler.bind(this, itemData.item.id)}>
            <EvilIcons name="minus" size={21} color={Colors.lightRed} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onToggleCheckHandler.bind(this, itemData.item.id)}>
          {isChecked ? (
            <View style={styles.ingredientContainer}>
              <Text
                style={{
                  color: Colors.green,
                  width: '95%',
                  textDecorationLine: 'line-through',
                }}>
                {titleCase(ingredient.name)}
              </Text>
              <MaterialIcons name="check-box" size={19} color={Colors.green} />
            </View>
          ) : (
            <View style={styles.ingredientContainer}>
              <Text style={{color: Colors.gray, width: '95%'}}>
                {titleCase(ingredient.name)}
              </Text>
              <MaterialIcons
                name="check-box-outline-blank"
                size={19}
                color={Colors.gray}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topControllerContainer}>
        <Text
          style={{
            color: Colors.gray,
          }}>{`${checkedCount} / ${shoppingList.length}`}</Text>

        <TouchableOpacity onPress={onCheckAllToggleHandler}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: Colors.gray}}>{`All `}</Text>
            <MaterialIcons
              name={isAllChecked ? 'check-box' : 'check-box-outline-blank'}
              size={19}
              color={isAllChecked ? Colors.green : Colors.gray}
            />
          </View>
        </TouchableOpacity>
      </View>
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
      <View style={styles.bottomControlContainer}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={addToPantryHandler}>
            <View style={styles.buttonContainer}>
              <MaterialIcons name="playlist-add" size={20} color="white" />
              <Text style={styles.buttonLabel}>Add to pantry</Text>
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
  flatList: {
    marginTop: 5,
  },
  flatListContainer: {
    width: '100%',
    height: '87%',
    paddingBottom: 5,
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
  topControllerContainer: {
    flexDirection: 'row',
    height: '5%',
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: Colors.primaryColor,
  },
  bottomControlContainer: {
    height: '8%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderTopWidth: 0.5,
    borderTopColor: Colors.primaryColor,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    height: 35,
    width: 200,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 3,
  },
});

export default ShoppingListScreen;
