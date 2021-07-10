import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Chip} from 'react-native-elements';

import {titleCase} from '../utils/StringUtil';
import Card from '../components/Card';
import IngredientChip from '../components/IngredientChip';
import Colors from '../constants/Colors';
export default class IngredientCategory extends Component {
  state = {
    isFullList: false,
    selectedIngs: [],
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.isFullList !== this.state.isFullList ||
      nextProps.selectedCount !== this.props.selectedCount
    );
  }

  render() {
    const ingredientList = this.props.ingredientCodes;
    const partialList = ingredientList.slice(0, 8);
    const {isFullList} = this.state;
    var currentList = isFullList ? ingredientList : partialList;

    const toggleFullListHandler = () => {
      this.setState({isFullList: !isFullList});
    };

    const onSelectIngredientHandler = (id, isSelected) => {
      this.props.onSelectIngredient(this.props.catId, id, isSelected);
    };

    return (
      <Card style={styles.cardStyle}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>
              {titleCase(this.props.title)}
            </Text>
            <Text style={styles.ingCount}>
              {this.props.selectedCount}/{ingredientList.length}
            </Text>
          </View>
          <Button
            type="clear"
            onPress={toggleFullListHandler}
            icon={
              <Icon
                name={
                  isFullList ? 'chevron-up-outline' : 'chevron-down-outline'
                }
                size={20}
                color={Colors.primaryColor}
                type="ionicon"
              />
            }
          />
        </View>

        <View style={styles.chipsContainer}>
          {currentList.map(ingredient => (
            <IngredientChip
              catId={this.props.catId}
              title={ingredient.name}
              key={ingredient.id}
              id={ingredient.id}
              shouldRefresh={this.props.shouldRefresh}
              isSelected={ingredient.isSelected}
              onSelectIngredient={onSelectIngredientHandler}
            />
          ))}

          {isFullList ? null : (
            <Chip
              title={'Show more...'}
              onPress={toggleFullListHandler}
              containerStyle={styles.lastChipContainer}
              buttonStyle={styles.lastChipButton}
              titleStyle={styles.lastChipTitle}
            />
          )}
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
    color: Colors.primaryColor,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.primaryColor,
    alignContent: 'space-between',
    justifyContent: 'space-between',
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 17,
  },
  lastChipButton: {
    backgroundColor: Colors.lightGray,
  },
  lastChipTitle: {
    fontSize: 11,
  },
  lastChipContainer: {
    marginHorizontal: 3,
    marginVertical: 3,
    overflow: 'hidden',
  },
});
