import React, {useState, useEffect, useRef, Component} from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../constants/Colors';
import {
  saveSelectedIngredients,
  getSelectedIngredients,
} from '../components/asyncStorage/selectedIngredients';

export default class IngredientChip extends Component {
  state = {
    //isSelected: this.props.isSelected,
  };

  // componentDidMount() {
  //   this.setState({isSelected: this.props.isSelected});
  // }

  // shouldComponentUpdate(nextProps, nextState){
  //   console.log("==>" + nextProps.isSelected + "--" + nextProps.title )
  //   return nextProps.isSelected !== this.props.isSelected;
  // }

  render() {
    const isSelected = this.props.isSelected;

   // console.log('Refreshed!' + this.props.id);
    // console.log('here!!' + props.shouldRefresh);
    //console.log(props.isSelected);

    // useEffect(() => {
    //   getSelectedIngredients(props.catId).then(selectIngredientsFromStorage => {
    //     if (!mountedRef.current) {
    //       // so it will return if component is not mounted
    //       return null;
    //     }
    //     console.log(props.catId + "||==>" + selectIngredientsFromStorage);
    //     setIsSelected(selectIngredientsFromStorage.includes(props.id)); // setting the initial
    //   });
    // }, [shouldRefresh]);

    // useEffect(()=>{
    //   setIsSelected();
    // })

    const onIngToggleHandler = () => {
      console.log('=> ' + this.props.id);
      getSelectedIngredients(this.props.catId).then(selectIngredientsFromStorage => {
        const selectedIngIndex = selectIngredientsFromStorage.indexOf(this.props.id);
        if (selectedIngIndex >= 0) {
          selectIngredientsFromStorage.splice(selectedIngIndex, 1);
        } else {
          selectIngredientsFromStorage.push(this.props.id);
        }

        saveSelectedIngredients(this.props.catId, selectIngredientsFromStorage);
      });

      this.props.onCountChange(isSelected ? -1 : 1);
      //this.setState({isSelected: !isSelected});
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
