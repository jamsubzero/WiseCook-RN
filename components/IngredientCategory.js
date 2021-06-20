import React, {PureComponent, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {titleCase} from '../utils/StringUtil';

import Card from '../components/Card';
import IngredientChip from '../components/IngredientChip';
import Colors from '../constants/Colors';
export default class IngredientCategory extends PureComponent {
  state = {
    isFullList: false,
  };
  render() {
    const ingredientList = this.props.ingredientCodes;
    const partialList = ingredientList.slice(0, 8);
    const {isFullList} = this.state;
    var currentList = isFullList ? ingredientList : partialList;

    const toggleFullListHandler = () => {
      this.setState({isFullList: !isFullList})
    }

    return (
      <Card style={styles.cardStyle}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>
              {titleCase(this.props.title)}
            </Text>
            <Text style={styles.ingCount}>0/{ingredientList.length}</Text>
          </View>
          <Button
            type="clear"
            onPress={toggleFullListHandler}
            icon={
              <Icon
                name={isFullList ? "chevron-up-outline" : "chevron-down-outline" }
                size={20}
                color="black"
                type="ionicon"
              />
            }
          />
        </View>

        <View style={styles.chipsContainer}>
          {/* TODO check here if an ingredient is selected from the asyncstorage or redux.
              Then add is to the isSelected prop of the chip*/}
          {/* <IngredientChip title="salt" isSelected={true} /> */}
          {currentList.map(ingredient => (
            <IngredientChip title={ingredient.name} key={ingredient.id} />
          ))}
        </View>
      </Card>
    );
  }
}

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
    color: Colors.primaryColor,
  },
  ingCount: {
    fontSize: 9,
    color: Colors.gray,
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
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 17,
  },
});
