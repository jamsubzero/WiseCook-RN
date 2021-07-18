import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import {
  getShoppingList,
  saveShoppingList,
} from '../../components/asyncStorage/selectedIngredients';

const ShoppingListScreen = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getShoppingList().then(shoppingListFromStorage => {
      setShoppingList(shoppingListFromStorage);
      console.log(shoppingListFromStorage);
    });
  }, [isFocused]);

  const renderShoppingList = itemData => {
    return <Text>{itemData.item}</Text>;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.flatListContainer}>
        <FlatList
        keyExtractor={item=>item }
          style={styles.flatList}
          data={shoppingList}
          renderItem={renderShoppingList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    width: '100%',
    marginTop: 5,
  },
  flatListContainer: {
    width: '100%',
    // marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 5,
  },
});

export default ShoppingListScreen;
