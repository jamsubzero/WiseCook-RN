import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';

import Colors from '../../../constants/Colors';

const SearchRecipe = props => {
  const [searchKey, setSearchKey] = useState('');

  let TouchableCmp = TouchableOpacity;
  if (Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{`   Search recipe   `}</Text>
      </View>
      <View style={styles.searchFieldContainer}>
        <TextInput
          autoFocus={true}
          placeholder={'Enter recipe name...'}
          placeholderTextColor={Colors.lightGray}
          style={styles.searchField}
          onChangeText={setSearchKey}
          value={searchKey}
          returnKeyType='search'
          blurOnSubmit={true}
          onSubmitEditing={props.onSearch.bind(this, searchKey)}
        />

        <Button
          onPress={props.onSearch.bind(this, searchKey)}
          icon={
            <Ionicons name="search" size={24} color={Colors.primaryColor} />
          }
          type="clear"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    height: 120,
    alignItems: 'center',
    borderRadius: 6,
    padding: 5,
    borderWidth: 0,
    backgroundColor: 'white',
    alignContent: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 0.5,
    paddingBottom: 4,
    height: 10,
    marginVertical: 2,
  },
  titleText: {
    color: Colors.primaryColor,
    fontSize: 20,
  },
  searchFieldContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    borderRadius: 7,
    padding: 3,
    margin: 10,
    paddingLeft: 10,
    paddingRight: 5,
    alignItems: 'center',
    borderColor: Colors.primaryColor,
    borderWidth: 1,
  },
  searchField: {
    color: Colors.primaryColor,
    width: '93%',
  },
});

export default SearchRecipe;
