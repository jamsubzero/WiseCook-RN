import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import Colors from '../../../constants/Colors';

const WithOneIngredientPreview = props => {
  const preview = props.preview;
  const previewRecipeList = preview.previewRecipes;
  const [firstRecipe, ...rest] = previewRecipeList;
  return (
    <View style={styles.previewContainer}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Using your {preview.ingredientName}
        </Text>
        <Text style={styles.sectionTitle}>See all ></Text>
      </View>
      <View style={styles.firstImageContainer}>
        <Image source={{uri: firstRecipe.imageUrl}} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  sectionTitle: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
  firstImageContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10
  },
  image: {
    width: '95%',
    height: 200,
    borderRadius: 10,
  },
});

export default WithOneIngredientPreview;
