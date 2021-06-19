import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import IngredientCategory from '../components/IngredientCategory';
import Colors from '../constants/Colors';

const PantryScreen = () => {
  const arr = [
    {name: 'meat', id: '1'},
    {name: 'vegetables', id: '2'},
    {name: 'condiments', id: '3'},
    {name: 'fruits', id: '4'},
    {name: 'poultry', id: '5'},
    {name: 'natives', id: '6'},
  ];
  return (
    <ScrollView style={styles.scrollView}>
      {arr.map(item => (
        <IngredientCategory title={item.name} key={item.id} />
      ))}

      {/* <IngredientCategory />
        <IngredientCategory /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    paddingTop: 2
  },
});

export default PantryScreen;
