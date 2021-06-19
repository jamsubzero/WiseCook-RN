import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import { Icon } from 'react-native-elements';
import { titleCase } from '../utils/StringUtil';

import Card from '../components/Card';
import IngredientChip from '../components/IngredientChip';
import Colors from '../constants/Colors';

const IngredientCategory = props => {
  return (
    <Card style={styles.cardStyle}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryDetails}>
          <Text style={styles.categoryName}>{titleCase(props.title)}</Text>
          <Text style={styles.ingCount}>2/20</Text>
        </View>
        <Icon name='chevron-down-outline' size={20} color='black' type='ionicon'/>
      </View>

      <View style={styles.chipsContainer}>
          {/* TODO this will be dynamic */}
        <IngredientChip title="salt" isSelected={true} />
        <IngredientChip title="Chicken" />
        <IngredientChip title="Curry powder" />
        <IngredientChip title="Pepper" />
        <IngredientChip title="Banana" />
        <IngredientChip title="Rosemary" />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    marginHorizontal: 8,
    marginVertical: 5,
    padding: 0,
  },
  categoryDetails: {
    alignContent: 'flex-start',
  },
  categoryName: {
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.primaryColor
  },
  ingCount: {
      fontSize: 9,
      color: Colors.gray
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.gray,
    alignContent: 'space-between',
    justifyContent: 'space-between',
    width: '100%'
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 17
  },
});

export default IngredientCategory;
