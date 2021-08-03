import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constants/Colors';

const RecipeInfo = props => {
  if (!props.info || props.info.length <= 0) {
    return null;
  }

  return (
    <View style={{...props.containerStyle, ...styles.infoItem}}>
      <MaterialCommunityIcons
        name={props.iconName}
        size={15}
        color={Colors.primaryColor}
      />
      <Text numberOfLines={1} style={styles.info}>
        {props.info}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    info: {
        fontSize: 13,
        color: Colors.gray,
        padding: 0,
        marginLeft: 5,
        flexWrap: 'wrap',
      },
      infoItem: {
        paddingVertical: 2,
        marginRight: 8,
        marginLeft: 3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },

});

export default RecipeInfo;
