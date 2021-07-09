import React, {useCallback, useEffect, useState} from 'react';
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

import IngredientCategory from '../../components/IngredientCategory';
import IngredientListFooter from '../../components/IngredientListFooter';
import ConnectionErrorMessage from '../../components/ConnectionErrorMessage';
import Colors from '../../constants/Colors';
import APIUrls from '../../constants/APIUrls';
import {
  saveSelectedIngredients,
  getAllSelectedIngredients,
  getSelectedIngredients,
} from '../../components/asyncStorage/selectedIngredients';

import IngredientSearchBar from './components/IngredientSearchBar';

const PantryScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]); // array of ingredientCategories

  const [searchIngCodes, setSearchIngCodes] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
  const [ingSearchKeyword, setIngSearchKeyword] = useState('');

  const [refreshList, setRefreshList] = useState(false); // flatlist extra data to refresh list

  useEffect(() => {
    getIngredientsFromWiseCookApi();
  }, []);

  const getIngredientsFromWiseCookApi = () => {
    return fetch(APIUrls.INGREDIENT_LIST_URL)
      .then(response => response.json())
      .then(json => {
        // setIngredients(json);
        // extractIngCodes(json);
        setStatus(json);
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
    // .finally(() => setIsLoading(false));
  };

  const setStatus = json => {
    getAllSelectedIngredients().then(allSelectIngredientsFromStorage => {
      for (let i = 0; i < json.length; i++) {
        let count = 0;
        for (let j = 0; j < json[i].ingredientCodes.length; j++) {
          let code = json[i].ingredientCodes[j];
          if (allSelectIngredientsFromStorage.includes(code.id)) {
            json[i].ingredientCodes[j].isSelected = true;
            count = count + 1;
          } else {
            json[i].ingredientCodes[j].isSelected = false;
          }

          //console.log(json[i].ingredientCodes[j]);
        }
        json[i].selectedCount = count;
      }

      // for (let i = 0; i < json.length; i++) {
      //   console.log(json[i]);
      //   for (let j = 0; j < json[i].ingredientCodes.length; j++) {
      //     //console.log(json[i].ingredientCodes[j]);
      //   }
      // }

      var ingCodes = [];
      for (const ingCategory of json) {
        ingCodes.push(ingCategory.ingredientCodes);
      }
      var allIngCodes = Array.prototype.concat.apply([], ingCodes);
      setSearchIngCodes(allIngCodes);

      setIngredients(json);
      setIsLoading(false);
    });
  };

  const onSelectIngredientHandler = (catId, id, isSelected) => {
    console.log('Home' + catId + ' -- ' + id + '--' + isSelected);
    let ingList = ingredients.slice();
    const catIndex = ingList.findIndex(cat => cat.id === catId);
    const ingIndex = ingList[catIndex].ingredientCodes.findIndex(
      ingCode => ingCode.id === id,
    );
    ingList[catIndex].ingredientCodes[ingIndex].isSelected = isSelected;
    console.log('count: ' + ingList[catIndex].selectedCount);

    const size = ingList[catIndex].ingredientCodes.filter(ingCode => ingCode.isSelected).length;

    ingList[catIndex].selectedCount = size;

    // if (isSelected) {
    //   ingList[catIndex].selectedCount = ingList[catIndex].selectedCount + 1;
    //   console.log("added!");
    // } else {
    //   ingList[catIndex].selectedCount = ingList[catIndex].selectedCount - 1;
    //   console.log("subtracted!");
    // }

    console.log('count: ' + ingList[catIndex].selectedCount);
    setIngredients(ingList);
  };

  // console.log(catIndex + ingCodes);

  const renderIngredient = itemData => {
    return (
      <IngredientCategory
        title={itemData.item.name}
        ingredientCodes={itemData.item.ingredientCodes}
        catId={itemData.item.id}
       // shouldRefresh={refreshList}
        selectedCount={itemData.item.selectedCount}
        onSelectIngredient={onSelectIngredientHandler}
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

 

  const onSelectSearchHandler = item => {
    //

    onSelectIngredientHandler(
      item.ingredientCategory,
      item.id,
      item.isSelected,
    );

    
    getSelectedIngredients(item.ingredientCategory).then(
      selectIngredientsFromStorage => {
        const selectedIngIndex = selectIngredientsFromStorage.indexOf(item.id);
        if (selectedIngIndex >= 0) {
          selectIngredientsFromStorage.splice(selectedIngIndex, 1);
        } else {
          selectIngredientsFromStorage.push(item.id);
        }

        saveSelectedIngredients(
          item.ingredientCategory,
          selectIngredientsFromStorage,
        );
      },
    );

    let ingCodeList = searchIngCodes.slice();
    const codeIndex = ingCodeList.findIndex(code => code.id === item.id);
    ingCodeList[codeIndex].isSelected = !item.isSelected;
    setSearchIngCodes(ingCodeList);


    // ToastAndroid.show(`Successfully added ${item.name}`, ToastAndroid.LONG);
    // setIngSearchKeyword('');
    // setRefreshList(!refreshList);
    
  };

  return (
    <View style={styles.screen}>
      {/* <View style={styles.autocompleteContainer}> */}
      
      <IngredientSearchBar onSelectSearch={onSelectSearchHandler} searchIngCodes={searchIngCodes} />
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
        extraData={refreshList}
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
  
});

export default PantryScreen;
