import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import {FAB, Button} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Snackbar from 'react-native-snackbar';
import Autocomplete from 'react-native-autocomplete-input';

import IngredientCategory from '../../components/IngredientCategory';
import IngredientListFooter from '../../components/IngredientListFooter';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import {
  saveSelectedIngredients,
  getAllSelectedIngredients,
} from '../../components/asyncStorage/selectedIngredients';

const PantryScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]); // array of ingredientCategories

  const [ingredientCodes, setIngredientCodes] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
  const [ingSearchKeyword, setIngSearchKeyword] = useState('');

  useEffect(() => {
    getIngredientsFromWiseCookApi();
  }, []);

  const getIngredientsFromWiseCookApi = () => {
    return fetch(APIUrls.INGREDIENT_LIST_URL)
      .then(response => response.json())
      .then(json => {
        setIngredients(json);
        extractIngCodes(json);
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
              getIngredientsFromWiseCookApi();
            },
          },
        });
      })
      .finally(() => setIsLoading(false));
  };

  const extractIngCodes = json => {
    var ingCodes = [];
    for (const ingCategory of json) {
      ingCodes.push(ingCategory.ingredientCodes);
    }

    getAllSelectedIngredients().then(allSelectIngredientsFromStorage => {
      var allIngCodes = Array.prototype.concat.apply([], ingCodes);

      var ingWithStatus = [];
      for (var i = 0; i < allIngCodes.length; i++) {
        var curIng = allIngCodes[i];
        if (allSelectIngredientsFromStorage.includes(curIng.id)) {
          curIng.isSelected = true;
        } else {
          curIng.isSelected = false;
        }

        ingWithStatus.push(curIng);
      }

      setIngredientCodes(ingWithStatus);
    });
  };

  const renderIngredient = itemData => {
    return (
      <IngredientCategory
        title={itemData.item.name}
        ingredientCodes={itemData.item.ingredientCodes}
        catId={itemData.item.id}
      />
    );
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

  const onRecipeSearchHandler = () => {
    props.navigation.navigate('Recipe');
  };

  const findIng = query => {
    // Method called every time when we change the value of the input
    if (query) {
      // Making a case insensitive regular expression
      const regex = new RegExp(`${query.trim()}`, 'i');

      setFilteredIngredients(
        ingredientCodes.filter(ing => ing.name.search(regex) >= 0),
      );
    } else {
      // If the query is null then return blank
      setFilteredIngredients([]);
    }

    setIngSearchKeyword(query);
  };

  return (
    <View style={styles.screen}>
      {/* <View style={styles.autocompleteContainer}> */}
      <View style={styles.topControlsContainer}>
        <View
          style={{
            borderColor: Colors.primaryColor,
            borderWidth: 0.5,
            width: '90%',
            height: 40,
            justifyContent: 'center',
            borderRadius: 8,
            paddingLeft: 7,
          }}>
          <Ionicons name="search" size={20} color={Colors.primaryColor} />
        </View>
        <Button
          type="clear"
          icon={
            <MaterialCommunityIcons
              name="microphone"
              size={30}
              color={Colors.primaryColor}
            />
          }
        />
      </View>

      <Autocomplete
        autoCorrect={false}
        style={{color: Colors.primaryColor}}
        inputContainerStyle={{
          backgroundColor: 'transparent',
          height: 37,
          width: '100%',
          borderWidth: 0,
          paddingVertical: 0,
          borderColor: Colors.primaryColor,
          paddingHorizontal: 5,
        }}
        placeholderTextColor={Colors.gray}
        containerStyle={styles.autocompleteContainer}
        onBlur={() => setFilteredIngredients([])}
        data={filteredIngredients}
        value={ingSearchKeyword}
        onChangeText={text => findIng(text)}
        placeholder="Add ingredient"
        flatListProps={{
          keyboardShouldPersistTaps: 'always',
          keyExtractor: item => item.id,
          renderItem: ({item}) => (
            // TODO: extract this render item into a function
            <TouchableOpacity
              onPress={() => {
                setSelectedValue(item);
                setFilteredIngredients([]);
                Keyboard.dismiss();
                ToastAndroid.show(
                  `Successfully added ${item.name}`,
                  ToastAndroid.LONG,
                );
                setIngSearchKeyword('');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  paddingLeft: 10,
                  paddingRight: 15,
                }}>
                {/* TODO Extract this into a separate component */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  {item.isSelected ? (
                    <FontAwesome5
                      name="minus-circle"
                      size={15}
                      color={Colors.lightRed}
                    />
                  ) : (
                    <FontAwesome5
                      name="plus-circle"
                      size={15}
                      color={Colors.green}
                    />
                  )}
                  <Text
                    style={{
                      ...styles.itemText,
                      ...{color: item.isSelected ? 'green' : Colors.gray},
                    }}>{`${item.name}`}</Text>
                </View>
                {item.isSelected ? (
                  <Ionicons name="checkmark" size={18} color={Colors.green} />
                ) : null}
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={ingredients}
        renderItem={renderIngredient}
        ListFooterComponent={<IngredientListFooter />}
        onRefresh={onRefreshHandler}
        refreshing={isLoading}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        removeClippedSubviews={false}
        onEndReachedThreshold={0.1}
      />

      <FAB
        title="My pantry"
        placement="left"
        style={{bottom: 8}}
        color={Colors.lightBlue}
        containerStyle={{elevation: 25}}
        // buttonStyle={{borderWidth: 5, borderColor: '#4285f4'}}
        titleStyle={{color: 'white'}}
        size="large"
        //knife, pot, pot mix, pot-steam,pot-steam-outline
      />

      <FAB
        onPress={onRecipeSearchHandler}
        title="Let's cook"
        placement="right"
        style={{bottom: 8}}
        color={Colors.blue}
        containerStyle={{elevation: 25}}
        size="large"
        icon={<MaterialCommunityIcons name="knife" size={25} color="white" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  topControlsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 55,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
    paddingLeft: 4,
    paddingBottom: 0,
    paddingTop: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightGray,
  },
  autocompleteContainer: {
    // Hack required to make the autocomplete
    // work on Andrdoid
    right: 0,
    top: 12,
    left: 30,
    flex: 1,
    position: 'absolute',
    zIndex: 2,

    width: '80%',
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
    color: Colors.gray,
    marginLeft: 8,
  },
});

export default PantryScreen;
