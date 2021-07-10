import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../constants/Colors';
import {
  saveSelectedIngredients,
  getSelectedIngredients,
} from '../components/asyncStorage/selectedIngredients';

export default class IngredientChip extends Component {
  render() {
    const isSelected = this.props.isSelected;

    const onIngToggleHandler = () => {
      getSelectedIngredients(this.props.catId).then(
        selectIngredientsFromStorage => {
          const selectedIngIndex = selectIngredientsFromStorage.indexOf(
            this.props.id,
          );
          if (selectedIngIndex >= 0) {
            selectIngredientsFromStorage.splice(selectedIngIndex, 1);
          } else {
            selectIngredientsFromStorage.push(this.props.id);
          }

          saveSelectedIngredients(
            this.props.catId,
            selectIngredientsFromStorage,
          );
        },
      );

      this.props.onSelectIngredient(this.props.id, !isSelected);
    };

    if (isSelected) {
      return (
        <Chip
          title={this.props.title}
          onPress={onIngToggleHandler}
          containerStyle={styles.containerStyle}
          buttonStyle={styles.buttonSelectedStyle}
          titleStyle={styles.titleStyle}
          icon={{
            name: 'checkmark',
            type: 'ionicon',
            size: 16,
            color: 'white',
          }}
        />
      );
    }

    return (
      <Chip
        title={this.props.title}
        onPress={onIngToggleHandler}
        containerStyle={styles.containerStyle}
        buttonStyle={styles.buttonNotSelectedStyle}
        titleStyle={styles.titleStyle}
      />
    );
  }
}

const styles = StyleSheet.create({
  buttonSelectedStyle: {
    backgroundColor: Colors.primaryColor,
  },
  buttonNotSelectedStyle: {
    backgroundColor: Colors.lightGray,
  },
  titleStyle: {
    fontSize: 11,
  },
  containerStyle: {
    marginHorizontal: 3,
    marginVertical: 3,
    overflow: 'hidden',
  },
});
