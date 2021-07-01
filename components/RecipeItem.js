import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Card from '../components/Card';
import Colors from '../constants/Colors';
import RecipeInfo from './RecipeInfo';
export default class RecipeItem extends PureComponent {
  render() {
    const itemData = this.props.itemData;

    let TouchableCmp = TouchableOpacity;
    if (Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }

    return (
      <Card style={styles.cardStyle}>
        <TouchableCmp onPress={this.props.onSelectRecipe} useForeground={true}>
          <View style={styles.recipeItemContainer}>
            <Image
              source={{uri: itemData.item.imageUrl}}
              style={styles.image}
            />

            <View style={styles.infoContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {itemData.item.title}
                </Text>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.infoItem}>
                  <FontAwesome5
                    name="carrot"
                    size={15}
                    color={Colors.primaryColor}
                  />
                  <Text numberOfLines={1} style={styles.info}>
                    <Text>Using your </Text>
                    <Text style={{fontWeight: 'bold'}}>
                      {itemData.item.hits}
                    </Text>
                    <Text> ingredients</Text>
                  </Text>
                </View>

                <RecipeInfo
                  iconName="bread-slice-outline"
                  info={itemData.item.servings}
                />
                <RecipeInfo
                  iconName="clock-outline"
                  info={itemData.item.time}
                />
              </View>
            </View>
          </View>
        </TouchableCmp>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    marginHorizontal: 8,
    marginVertical: 3,
    padding: 0,
    height: 150,
    overflow: 'hidden',
  },
  recipeItemContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    width: '40%',
    height: 150,
  },
  infoContainer: {
    flex: 1,
    margin: 5,
    marginLeft: 7,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  title: {
    flexWrap: 'wrap',
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.primaryColor,
  },
  info: {
    fontSize: 13,
    color: Colors.gray,
    padding: 0,
    marginLeft: 5,
    flexWrap: 'wrap',
  },
  hitsInfo: {
    fontSize: 13,
    color: Colors.primaryColor,
    padding: 0,
    marginLeft: 5,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  titleContainer: {
    borderBottomWidth: 0.3,
    alignContent: 'center',
    paddingBottom: 5,
    marginRight: 10,
    width: '95%',
    borderBottomColor: Colors.gray,
  },
  infoItem: {
    paddingVertical: 2,
    marginRight: 8,
    marginLeft: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginTop: 3,
  },
});
