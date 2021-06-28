import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../../constants/Colors';
import Card from '../../../components/Card';

const WithOneIngredientPreview = props => {
  const preview = props.preview;
  const previewRecipeList = preview.previewRecipes;
  const [firstRecipe, ...rest] = previewRecipeList;

  const renderRest = dataItem => {
    return (
      <Card style={styles.cardStyle}>
        <Image
          source={{uri: dataItem.item.imageUrl}}
          style={styles.restImage}
        />
      </Card>
    );
  };

  return (
    <View style={styles.previewContainer}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Using your {preview.ingredientName}
        </Text>
        <View style={styles.seeAllContainer}>
          <Text style={styles.seeAllText}>
            See all{' '}
            <FontAwesome5Icon
              name="chevron-right"
              size={13}
              color={Colors.primaryColor}
            />
          </Text>
        </View>
      </View>
      <View style={styles.firstImageContainer}>
        <Card style={styles.firstImageCard}>
          <ImageBackground
            source={{uri: firstRecipe.imageUrl}}
            style={styles.firstImage}>
            <Text style={styles.firstImageTitle} numberOfLines={2}>{firstRecipe.title}</Text>
          </ImageBackground>
        </Card>
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={rest}
        keyExtractor={item => item.id}
        renderItem={renderRest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 7,
    marginBottom: 13
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  sectionTitle: {
    color: Colors.darkgray,
    fontSize: 16,
  },
  firstImageContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
    marginVertical: 10,
    alignContent: 'center',
    justifyContent: 'center'
  },
  firstImageCard:{
    padding: 0,
    width: '88%',
    height: 150,
    borderRadius: 4,
    elevation: 2,
    overflow: 'hidden'
  },
  firstImage: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  firstImageTitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'left',
    marginLeft: 8,
    marginBottom: 5,
  },
  seeAllContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  seeAllText: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
  cardStyle: {
    marginHorizontal: 3,
    padding: 0,
    height: 100,
    width: 100,
    overflow: 'hidden',
    borderRadius: 4,
  },
  restImage: {
    width: 100,
    height: 100,
  },
  recipeImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
});

export default WithOneIngredientPreview;
