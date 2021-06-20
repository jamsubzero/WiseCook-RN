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

import IngredientCategory from '../components/IngredientCategory';
import IngredientListFooter from '../components/IngredientListFooter';
import Colors from '../constants/Colors';
import APIUrls from '../constants/APIUrls';

const PantryScreen = () => {
  const arr = [
    {name: 'meat', id: '1'},
    {name: 'vegetables', id: '2'},
    {name: 'condiments', id: '3'},
    {name: 'fruits', id: '4'},
    {name: 'poultry', id: '5'},
    {name: 'natives', id: '6', isLast: true},
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);

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
        console.error(error);
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

  const renderIngredient = itemData => {
    return (
      <IngredientCategory
        title={itemData.item.name}
        ingredientCodes={itemData.item.ingredientCodes}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={ingredients}
        renderItem={renderIngredient}
        ListFooterComponent={<IngredientListFooter />}
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
});

export default PantryScreen;
