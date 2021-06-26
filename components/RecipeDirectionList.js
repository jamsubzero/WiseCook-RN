import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Colors from '../constants/Colors';

const RecipeDirectionList = props => {
  const instructions = props.directions;
  return (
    <View style={styles.directionContainer}>
      <Text style={styles.directionsTitle}>Directions</Text>
      {instructions.map(instruction => (
        <View key={instruction.id} style={styles.directionRowContainer}>
          <Text style={styles.ingredientEntry}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNum}>{instruction.step}</Text>
            </View>
            <Text>{'  '}</Text>
            <Text>{instruction.ins}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  directionContainer: {
    marginHorizontal: 10,
    marginTop: 8,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.gray,
    paddingBottom: 20,
    marginBottom: 10,
  },
  directionsTitle: {
    color: Colors.primaryColor,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  directionRowContainer: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderColor: Colors.gray,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 0,
    borderTopWidth: 0.2,
  },
  stepNumCircle: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    borderRadius: 18 / 2,
    backgroundColor: Colors.primaryColor,
  },
  stepNum: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 12,
  },
});

export default RecipeDirectionList;
