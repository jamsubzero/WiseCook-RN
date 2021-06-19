import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import IngredientChip from '../components/IngredientChip';
import Colors from '../constants/Colors';

const PantryScreen = () => {
  return (
    <View style={styles.screen}>
     <IngredientChip title="salt" isSelected={true} />
     <IngredientChip title="Chicken"/>
     <IngredientChip title="Curry powder" />
     <IngredientChip title="Pepper"  />
     <IngredientChip title="Banana"/>
     <IngredientChip title="Rosemary" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8
  },
});

export default PantryScreen;
