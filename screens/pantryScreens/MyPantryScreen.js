import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../constants/Colors';
import {titleCase} from '../../utils/StringUtil';

const MyPantryScreen = props => {
  const pantryContents = props.route.params.selectedIngs;

  const renderIngs = itemData => {
    return (
      <View style={styles.ingredientContainer}>
        <Text style={{color: Colors.primaryColor}}>
          {titleCase(itemData.item.name)}
        </Text>
        <TouchableOpacity>
          <FontAwesome5Icon
            name="cart-plus"
            size={16}
            color='black'
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
    borderColor: Colors.primaryColor
 
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
