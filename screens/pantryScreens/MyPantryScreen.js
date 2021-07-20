import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../constants/Colors';
import {titleCase} from '../../utils/StringUtil';
import {
  getShoppingList,
  saveShoppingList,
} from '../../components/asyncStorage/selectedIngredients';

const MyPantryScreen = props => {
  const pantryContents = props.route.params.selectedIngs;
  const [shoppingList, setShoppingList] = useState([]);

  useState(() => {
    getShoppingList().then(shoppingListFromStorage => {
      setShoppingList(shoppingListFromStorage);
    });
  }, []);

  const onAddToShoppingListHandler = async (id) => {
    if (!id) {
      console.log('Error saving ing to shopping list, id is empty');
      return;
    }
    var shoppingListFromStorage = await getShoppingList();

    const selectedIngIndex = shoppingListFromStorage.findIndex(
      ing => ing.id === id,
    );
    if (selectedIngIndex < 0) {
      shoppingListFromStorage.push({id: id, isChecked: false});
      ToastAndroid.show(`Added to your shopping list`, ToastAndroid.SHORT);
    } else {
      shoppingListFromStorage.splice(selectedIngIndex, 1);
      ToastAndroid.show(`Excluded from your shopping list`, ToastAndroid.SHORT);
    }
    await saveShoppingList(shoppingListFromStorage);
    setShoppingList(shoppingListFromStorage);
  };

  const renderIngs = itemData => {
    const isOnShoppingList =
      shoppingList.findIndex(ing => ing.id === itemData.item.id) >= 0;
    return (
      <View style={styles.ingredientContainer}>
        <Text style={{color: Colors.primaryColor}}>
          {titleCase(itemData.item.name)}
        </Text>
        <TouchableOpacity
          onPress={onAddToShoppingListHandler.bind(this, itemData.item.id)}>
          <FontAwesome5Icon
            name="cart-plus"
            size={16}
            color={isOnShoppingList ? 'green' : 'black'}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.countContainer}>
        <Text
          style={
            styles.ingCountLabel
          }>{`You have ${pantryContents.length} ingredients in your pantry`}</Text>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          style={styles.flatList}
          data={pantryContents}
          renderItem={renderIngs}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  ingCountLabel: {
    color: Colors.gray,
  },
  countContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '5%',
    width: '100%',
    borderBottomWidth: 0.3,
    borderColor: Colors.primaryColor,
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
  ingredientContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.gray,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    height: 40,
  },
});

export default MyPantryScreen;
