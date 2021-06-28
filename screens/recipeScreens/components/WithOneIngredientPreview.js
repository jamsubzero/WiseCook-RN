import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Colors from '../../../constants/Colors';

const WithOneIngredientPreview = props => {
  return (
    <View style={styles.previewContainer}>
      <Text style={styles.sectionTitle}>Using your {props.ingredientName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    previewContainer: {
        flex: 1,
        margin: 10
    },
    sectionTitle:{
        color: Colors.primaryColor,
        fontSize: 16,
    }
});

export default WithOneIngredientPreview;
