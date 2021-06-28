import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Chip} from 'react-native-elements';

import {titleCase} from '../utils/StringUtil';
import Card from '../components/Card';
import IngredientChip from '../components/IngredientChip';
import Colors from '../constants/Colors';
import {getSelectedIngredients} from '../components/asyncStorage/selectedIngredients';
export default class IngredientCategory extends PureComponent {
  state = {
    isFullList: false,
    selectionCount: 0,
  };

  componentDidMount() {
    getSelectedIngredients(this.props.catId)
    .then(selectIngredientsFromStorage => {
      this.setState({selectionCount: selectIngredientsFromStorage.length});
    });
  }

  render() {
    const ingredientList = this.props.ingredientCodes;
    const partialList = ingredientList.slice(0, 8);
    const {isFullList} = this.state;
    var currentList = isFullList ? ingredientList : partialList;

    const toggleFullListHandler = () => {
      this.setState({isFullList: !isFullList});
    };

    const onCountChangeHandler = change => {
      console.log('count change: ' + change);
      var newCount = this.state.selectionCount + change;
      this.setState({selectionCount: newCount});
    };

    return (
      <Card style={styles.cardStyle}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>
              {titleCase(this.props.title)}
            </Text>
            <Text style={styles.ingCount}>
              {this.state.selectionCount}/{ingredientList.length}
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
          {/* TODO check here if an ingredient is selected from the asyncstorage or redux.
              Then add is to the isSelected prop of the chip*/}
          {/* <IngredientChip title="salt" isSelected={true} /> */}
          {currentList.map(ingredient => (
            <IngredientChip
              catId={this.props.catId}
              title={ingredient.name}
              key={ingredient.id}
              id={ingredient.id}
              onCountChange={onCountChangeHandler}
            />
          ))}

        {isFullList ? null :
          <Chip
            title={"Show more..."}
            onPress={toggleFullListHandler}
            containerStyle={styles.lastChipContainer}
            buttonStyle={styles.lastChipButton}
            titleStyle={styles.lastChipTitle}
          />
        }
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
