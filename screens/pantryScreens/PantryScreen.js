import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {FAB, Overlay} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import DictateIngredientsScreen from './DictateIngredientsScreen';

const PantryScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]); // array of ingredientCategories
  const [dictateVisible, setDictateVisible] = useState(false);

  useEffect(() => {
    getIngredientsFromWiseCookApi();
  }, []);

  const getIngredientsFromWiseCookApi = () => {
    return fetch(APIUrls.INGREDIENT_LIST_URL)
      .then(response => response.json())
      .then(json => {
        initializeIngs(json);
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

  const initializeIngs = json => {
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
        }
        json[i].selectedCount = count;
      }

      setIngredients(json);
      setIsLoading(false);
    });
  };

  const onSelectIngredientHandler = (catId, id, isSelected) => {
    let ingList = ingredients.slice();
    const catIndex = ingList.findIndex(cat => cat.id === catId);
    const ingIndex = ingList[catIndex].ingredientCodes.findIndex(
      ingCode => ingCode.id === id,
    );
    ingList[catIndex].ingredientCodes[ingIndex].isSelected = isSelected;

    const size = ingList[catIndex].ingredientCodes.filter(
      ingCode => ingCode.isSelected,
    ).length;

    ingList[catIndex].selectedCount = size;

    setIngredients(ingList);
  };

  const renderIngredient = itemData => {
    return (
      <IngredientCategory
        title={itemData.item.name}
        ingredientCodes={itemData.item.ingredientCodes}
        catId={itemData.item.id}
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
    onSelectIngredientHandler(
      item.ingredientCategory,
      item.id,
      !item.isSelected,
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
  };

  const onMyPantryHandler = () => {};

  const onNavigateToDictateHandler = () => {
    props.navigation.navigate('DictateIngredients');
  }

  const toggleOverlay = () => {
    setDictateVisible(!dictateVisible);
  };

  return (
    <View style={styles.screen}>
      <IngredientSearchBar
        onSelectSearch={onSelectSearchHandler}
        ingredients={ingredients}
        onNavigateToDictate={onNavigateToDictateHandler}
        onNavigateToDictate={toggleOverlay}
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
        onPress={onMyPantryHandler}
        titleStyle={{color: 'white'}}
        size="large"
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

      <Overlay
        overlayStyle={styles.dictateStyle}
        isVisible={dictateVisible}
        onBackdropPress={toggleOverlay}>
        <DictateIngredientsScreen ingredients={ingredients}/>
      </Overlay>
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
  dictateStyle: {
    padding: 0,
    elevation: 0,
    backgroundColor: 'red',
    width: '90%',
    height: '60%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden',
    borderRadius: 8

  },
});

export default PantryScreen;
