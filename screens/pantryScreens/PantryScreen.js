import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  ToastAndroid
} from 'react-native';
import {FAB, Button} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import Autocomplete from 'react-native-autocomplete-input';

import IngredientCategory from '../../components/IngredientCategory';
import IngredientListFooter from '../../components/IngredientListFooter';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';

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

    setIngredientCodes(Array.prototype.concat.apply([], ingCodes));
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
            <TouchableOpacity
              onPress={() => {
                setSelectedValue(item);
                setFilteredIngredients([]);
                Keyboard.dismiss();
                ToastAndroid.show(`Successfully added ${item.name}`, ToastAndroid.LONG);
                setIngSearchKeyword('');
              }}>
              <View style={{paddingVertical: 5, paddingLeft: 5}}>
                <Text style={styles.itemText}>{item.name}</Text>
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
  },
});

export default PantryScreen;
