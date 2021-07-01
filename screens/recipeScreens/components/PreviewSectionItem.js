import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../../constants/Colors';
import Card from '../../../components/Card';

const PreviewSectionItem = props => {
  const preview = props.preview;
  const previewRecipeList = preview.previewRecipes;
  const [firstRecipe, ...rest] = previewRecipeList;

  let TouchableCmp = TouchableOpacity;
  if (Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const onSelectRecipeHandler = id => {
    console.log(id);
    props.navigation.navigate('ViewRecipe', {selectedRecipeId: id});
  };

  const renderRest = dataItem => {
    return (
      <Card style={styles.restCard}>
        <TouchableCmp
          onPress={onSelectRecipeHandler.bind(this, dataItem.item.id)}
          useForeground={true}>
          <View>
            <ImageBackground
              source={{uri: dataItem.item.imageUrl}}
              style={styles.restImage}>
              <Text style={styles.restTitle} numberOfLines={2}>
                {dataItem.item.title}
              </Text>
            </ImageBackground>
          </View>
        </TouchableCmp>
      </Card>
    );
  };

  return (
    <View style={styles.previewContainer}>
      {/* <Card style={styles.mainCard}> */}
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
            <TouchableCmp
              onPress={onSelectRecipeHandler.bind(this, firstRecipe.id)}
              useForeground={true}>
              <View>
                <ImageBackground
                  source={{uri: firstRecipe.imageUrl}}
                  style={styles.firstImage}>
                  <Text style={styles.firstImageTitle} numberOfLines={2}>
                    {firstRecipe.title}
                  </Text>
                </ImageBackground>
              </View>
            </TouchableCmp>
          </Card>
        </View>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={rest}
          keyExtractor={item => item.id}
          renderItem={renderRest}
        />
      {/* </Card> */}
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    marginHorizontal: 7,
    marginTop: 2,
    marginBottom: 12,
  },
  mainCard: {
    padding: 5,
    borderRadius: 6
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
    justifyContent: 'center',
  },
  firstImageCard: {
    padding: 0,
    width: '88%',
    height: 150,
    borderRadius: 4,
    elevation: 0,
    overflow: 'hidden',
  },
  firstImage: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  firstImageTitle: {
    fontSize: 14,
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
  restCard: {
    marginHorizontal: 2,
    padding: 0,
    height: 100,
    width: 100,
    overflow: 'hidden',
    elevation: 0,
    borderRadius: 5,
  },
  restImage: {
    width: 100,
    height: 100,
    justifyContent: 'flex-end',
    padding: 5,
  },
  restTitle: {
    color: 'white',
    fontSize: 8,
  },
});

export default PreviewSectionItem;
