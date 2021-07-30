import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Purchases from 'react-native-purchases';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Card from './Card';
import Colors from '../constants/Colors';
import Color from 'color';

const PayWallScreen = props => {
  const [packages, setPackages] = useState([]);
  const benefits = [
    `Ad-free access to the app`,
    `Unlimited recipe suggestions`,
    `Access to all supported ingredients`,
    `Unlimited shopping list`,
    `Saving a recipe to favorites`,
  ];

  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setPackages(offerings.current.availablePackages);
        console.log(offerings.current.availablePackages);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topMessages}>
        <Text style={{fontSize: 20, color: Colors.primaryColor}}>
          {`Ads help me keep the app free.`}
        </Text>
        <Text
          style={{
            fontSize: 9,
            color: Colors.primaryColor,
            textAlign: 'center',
          }}>
          {`No one likes ads, I hate it too. However, it takes money to keep the app running, and these ads help me pay the bills.`}
        </Text>
      </View>
      <Card style={styles.cardStyle}>
        <View
          style={{
            marginBottom: 10,
            backgroundColor: '#cccccc',
            borderRadius: 2,
            paddingLeft: 5,
            paddingVertical: 7,
          }}>
          <Text
            style={{
              color: Colors.gray,
              fontSize: 15,
            }}>{`WiseCook supporters will get:`}</Text>
        </View>
        {benefits.map(benefit => {
          return (
            <Text style={{marginVertical: 5}} key={benefit}>
              <FontAwesome
                name="circle"
                size={10}
                color={Colors.primaryColor}
              />
              <Text style={{fontSize: 15, color: Colors.primaryColor}}>
                {`   ${benefit}`}
              </Text>
            </Text>
          );
        })}
      </Card>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          width: '80%',
          justifyContent: 'space-between',
         
         // borderWidth: 0.5,
        }}>
        <View
           style={{...styles.subscribeButton, ...{backgroundColor: Colors.gray}}}>
          <Text style={{color: 'white'}}>99 / month</Text>
        </View>

        <View
          style={styles.subscribeButton}>
          <Text style={{color: 'white'}}>33 / year</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topMessages: {
    marginVertical: 10,
    //  borderWidth: 0.5,
    alignItems: 'center',
    width: '80%',
  },
  cardStyle: {
    width: '80%',
    borderRadius: 5,
    elevation: 5,
    //  padding: 15
  },
  subscribeButton:{
    backgroundColor: Colors.primaryColor,
    height: 43,
    width: '48%',
    // marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});

export default PayWallScreen;
