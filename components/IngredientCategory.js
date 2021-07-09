import React, {PureComponent, Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Chip} from 'react-native-elements';

import {titleCase} from '../utils/StringUtil';
import Card from '../components/Card';
import IngredientChip from '../components/IngredientChip';
import Colors from '../constants/Colors';
import {getSelectedIngredients} from '../components/asyncStorage/selectedIngredients';
import {color} from 'react-native-elements/dist/helpers';
export default class IngredientCategory extends Component {
  state = {
    isFullList: false,
    selectionCount: this.props.selectedCount,
    selectedIngs: [],
  };

  componentDidMount() {
    this.setState({selectionCount: this.props.selectedCount});
    // getSelectedIngredients(this.props.catId)
    // .then(selectIngredientsFromStorage => {
    //   this.setState({selectionCount: selectIngredientsFromStorage.length});
    //   this.setState({selectedIngs: selectIngredientsFromStorage});
    //   console.log(this.props.catId + "==>" + selectIngredientsFromStorage);
    // });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return nextState.selectedCount !== this.state.selectedCount;
    //console.log(nextState.selectionCount + '--' + this.state.selectionCount);
    //console.log(nextProps.selectedCount + this.state.selectedCount);
    //console.log(nextProps.selectionCount);
    console.log("on category!" + nextProps.title + "=" +(nextProps.selectedCount  + "" + this.state.selectionCount));
    return (
      nextState.selectionCount !== this.state.selectionCount 
      ||
      nextState.isFullList !== this.state.isFullList
      ||
      typeof nextProps.selectionCount != "undefined"
      ||
      ((typeof nextProps.selectedCount != "undefined") && nextProps.selectedCount != this.state.selectionCount)
      ||
      ((typeof nextProps.selectedCount != "undefined") && nextProps.selectedCount != this.props.selectedCount)
    );
  }

  render() {
    console.log('here-!' + this.props.ingredientCodes);
    for(let i = 0; i < this.props.ingredientCodes.length; i ++){
      console.log(this.props.ingredientCodes[i]);
    }
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

    const onSelectIngredientHandler = (id, isSelected) => {
      console.log('=>' + id);
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
              shouldRefresh={this.props.shouldRefresh}
              // isSelected={this.state.selectedIngs.includes(ingredient.id)}
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
