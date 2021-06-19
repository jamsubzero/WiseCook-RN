import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {FAB, Button} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import IngredientCategory from '../components/IngredientCategory';
import Card from '../components/Card';
import Colors from '../constants/Colors';

const PantryScreen = () => {
  const arr = [
    {name: 'meat', id: '1'},
    {name: 'vegetables', id: '2'},
    {name: 'condiments', id: '3'},
    {name: 'fruits', id: '4'},
    {name: 'poultry', id: '5'},
    {name: 'natives', id: '6', isLast: true},
  ];
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollView}>
        {arr.map(item => (
          <IngredientCategory
            title={item.name}
            key={item.id}
            isLast={item.isLast}
          />
        ))}
        <View style={styles.endOfIngContainer}>
          <Text style={styles.endOfIngMessage}>
            That's all the ingredients we have for now.
          </Text>
        </View>
      </ScrollView>

      <FAB
        title="Let's cook"
        placement="right"
        style={{bottom: 8}}
        color="blue"
        containerStyle={{elevation: 25}}
        size="large"
        icon={<FontAwesome5 name="utensils" size={25} color="white" />}
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
  endOfIngContainer: {
    width: '100%',
    height: 55,
    backgroundColor: Colors.primaryColor,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  endOfIngMessage: {
    color: 'white',
  },
});

export default PantryScreen;
