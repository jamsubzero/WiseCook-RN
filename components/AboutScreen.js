import React from 'react';
import {Button} from 'react-native';
import {View, StyleSheet, Text, ScrollView, Linking} from 'react-native';

import Colors from '../constants/Colors';
import Preferences from '../constants/Preferences';

const AboutScreen = props => {
  
  const goToPayWallHandler = () => {
    props.navigation.navigate('PayWall')
  }

  const rateTheAppHandler = () => {
    Linking.openURL(`market://details?id=${Preferences.GOOGLE_PACKAGE_NAME}`).catch(err =>
      alert('Please check for Google Play Store'),
    );
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.titleText}>{`About WiseCook`}</Text>
          <Text style={styles.contentText}>
            {`WiseCook was initially my school project when I was studying at the university way back 2016.
During the COVID19 pandemic and everyone was stuck on their homes, I decided to revive the app just because I have nothing else to do.`}
          </Text>
          <Text style={styles.titleText}>{`How the app works`}</Text>
          <Text style={styles.contentText}>
            {`The app works like a search engine where it searches the internet for the matching recipes based on the given ingredients.`}
          </Text>

          <Text style={styles.titleText}>{`Disclaimer`}</Text>
          <Text style={styles.contentText}>
            {`As mentioned above, the app only relies on what it can find on the internet, I am NOT the author of those recipes.
 If you own those recipes, and you want your recipe to be excluded in the search, please email me at`}
          </Text>
          <Text style={styles.titleText}>{`wisecookapp@gmail.com`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 30,
            width: '70%',
            justifyContent: 'space-between',
          }}>
          <Button onPress={rateTheAppHandler} title="Rate the app" />
          <Button onPress={goToPayWallHandler} title="Remove ads" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  content: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    width: '85%',
  },
  titleText: {
    color: Colors.primaryColor,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  contentText: {
    color: Colors.primaryColor,
    textAlign: 'center',
  },
});

export default AboutScreen;
