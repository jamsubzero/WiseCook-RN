import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Button} from 'react-native-elements';
import Colors from '../../../constants/Colors';

const IngredientSearchBar = props => {
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [ingSearchKeyword, setIngSearchKeyword] = useState('');
  const [searchIngCodes, setSearchIngCodes] = useState([]);

  useEffect(() => {
    var ingCodes = [];
    for (const ingCategory of props.ingredients) {
      ingCodes.push(ingCategory.ingredientCodes);
    }
    var allIngCodes = Array.prototype.concat.apply([], ingCodes);
    setSearchIngCodes(allIngCodes);
  }, [props.ingredients]);

  const onSelectSearchHandler = item => {
    Keyboard.dismiss();
    setFilteredIngredients([]);

    ToastAndroid.show(`Successfully ${item.isSelected ? 'removed' : 'added'} ${item.name}`, ToastAndroid.LONG);
    setIngSearchKeyword('');

    props.onSelectSearch(item);
  };

  const findIng = query => {
    if (query) {
      const regex = new RegExp(
        `${query.trim().replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')}`,
        'i',
      );
      setFilteredIngredients(
        searchIngCodes.filter(ing => ing.name.search(regex) >= 0),
      );
    } else {
      setFilteredIngredients([]);
    }

    setIngSearchKeyword(query);
  };

  return (
    <View>
      <View style={styles.topControlsContainer}>
        <View
          style={{
            borderColor: Colors.primaryColor,
            borderWidth: 0.5,
            width: '90%',
            height: 40,
            justifyContent: 'center',
            borderRadius: 8,
            paddingLeft: 7,
          }}>
          <Ionicons name="search" size={20} color={Colors.primaryColor} />
        </View>
        <TouchableOpacity
          onPress={props.onNavigateToDictate}
          >
            <MaterialCommunityIcons
              name="microphone"
              size={30}
              color={Colors.primaryColor}
            />
        </TouchableOpacity>
      </View>

      <Autocomplete
        autoCorrect={false}
        style={{color: Colors.primaryColor}}
        inputContainerStyle={{
          backgroundColor: 'transparent',
          height: 37,
          width: '100%',
          borderWidth: 0,
          paddingVertical: 0,
          borderColor: Colors.primaryColor,
          paddingHorizontal: 5,
        }}
        placeholderTextColor={Colors.gray}
        containerStyle={styles.autocompleteContainer}
        onBlur={() => setFilteredIngredients([])}
        data={filteredIngredients}
        value={ingSearchKeyword}
        onChangeText={text => findIng(text)}
        placeholder="Add ingredient"
        flatListProps={{
          keyboardShouldPersistTaps: 'always',
          keyExtractor: item => item.id,
          renderItem: ({item}) => (
            <TouchableOpacity onPress={onSelectSearchHandler.bind(this, item)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  paddingLeft: 10,
                  paddingRight: 15,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  {item.isSelected ? (
                    <FontAwesome5
                      name="minus-circle"
                      size={15}
                      color={Colors.lightRed}
                    />
                  ) : (
                    <FontAwesome5
                      name="plus-circle"
                      size={15}
                      color={Colors.green}
                    />
                  )}
                  <Text
                    style={{
                      ...styles.itemText,
                      ...{color: item.isSelected ? 'green' : Colors.gray},
                    }}>{`${item.name}`}</Text>
                </View>
                {item.isSelected ? (
                  <Ionicons name="checkmark" size={18} color={Colors.green} />
                ) : null}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topControlsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 55,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 4,
    paddingBottom: 0,
    paddingTop: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightGray,
  },
  autocompleteContainer: {
    // Hack required to make the autocomplete
    // work on Andrdoid
    right: 0,
    top: 12,
    left: 30,
    flex: 1,
    position: 'absolute',
    zIndex: 2,

    width: '80%',
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
    color: Colors.gray,
    marginLeft: 8,
  },
});

export default IngredientSearchBar;
