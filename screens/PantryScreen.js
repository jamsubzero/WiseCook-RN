import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {FAB} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';
import {Icon} from 'react-native-elements';

import IngredientCategory from '../components/IngredientCategory';
import IngredientListFooter from '../components/IngredientListFooter';
import Colors from '../constants/Colors';
import APIUrls from '../constants/APIUrls';
import {
  saveSelectedIngredients,
  getSelectedIngredients,
} from '../components/asyncStorage/selectedIngredients';

const PantryScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    getSelectedIngredients(selectIngredientsFromStorage => {
      setSelectedIngredients(selectIngredientsFromStorage); // setting the initial
    });
  }, []);

  useEffect(() => {
    getIngredientsFromWiseCookApi();
  }, []);

  const getIngredientsFromWiseCookApi = () => {
    return fetch(APIUrls.INGREDIENT_LIST_URL)
      .then(response => response.json())
      .then(json => {
        setIngredients(json);
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

  const onIngToggleHandler = (ingId) => {
    console.log('==>' + ingId);

    let ingList = selectedIngredients.slice(); //copy the state
    const selectedIngIndex = ingList.indexOf(ingId);
    if (selectedIngIndex >= 0) {
      ingList.splice(selectedIngIndex, 1);
    } else {
      ingList.push(ingId);
    }
    setSelectedIngredients(ingList); // save to state
    saveSelectedIngredients(ingList); // save to storage
  };

  const renderIngredient = itemData => {
    return (
      <IngredientCategory
        title={itemData.item.name}
        ingredientCodes={itemData.item.ingredientCodes}
        onToggleIngredient={onIngToggleHandler}
        selectedIngs={selectedIngredients}
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
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.infoText}>
          Oh no! Something's really wrong here. {"\n"}
          If it's not you, perhaps WiseCook is down at the moment. {"\n"}
          Please try again later. {'\n'}
        </Text>
        <Icon
          name="coffee-off"
          size={24}
          color={Colors.primaryColor}
          type="material-community"
        />
      </View>
    );
  }

  const onRefreshHandler = () => {
    setIngredients([]);
    setIsLoading(true);
    getIngredientsFromWiseCookApi();
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={ingredients}
        renderItem={renderIngredient}
        ListFooterComponent={<IngredientListFooter />}
        extraData={selectedIngredients}
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
        title="I have(10)"
        placement="left"
        style={{bottom: 8}}
        color="white"
        containerStyle={{elevation: 25}}
        // buttonStyle={{borderWidth: 5, borderColor: '#4285f4'}}
        titleStyle={{color: '#4285f4'}}
        size="large"
        //knife, pot, pot mix, pot-steam,pot-steam-outline
      />

      <FAB
        title="Let's cook"
        placement="right"
        style={{bottom: 8}}
        color="#4285f4"
        containerStyle={{elevation: 25}}
        size="large"
        icon={<MaterialCommunityIcons name="knife" size={25} color="white" />}
        //knife, pot, pot mix, pot-steam,pot-steam-outline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    paddingTop: 2,
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
