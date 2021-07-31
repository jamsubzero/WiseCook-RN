import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import Purchases from 'react-native-purchases';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Card from './Card';
import Colors from '../constants/Colors';
import Preferences from '../constants/Preferences';
import { Alert } from 'react-native';

const PayWallScreen = props => {
  const [monthlyPackage, setMonthlyPackage] = useState('');
  const [yearlyPackage, setYearlyPackage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
        var monthly = offerings.current.availablePackages.find(
          pack => pack.packageType === 'MONTHLY',
        );
        console.log(monthly);
        setMonthlyPackage(monthly);
        var yearly = offerings.current.availablePackages.find(
          pack => pack.packageType === 'ANNUAL',
        );
        setYearlyPackage(yearly);
        console.log(yearly);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  const onPurchaseHandler = async selectedPackage => {
    try {
      const purchaseMade = await Purchases.purchasePackage(selectedPackage);
      if (typeof purchaseMade.purchaserInfo.entitlements.active[Preferences.ENTITLEMENT_ID] !== 'undefined') {
        // Unlock that great "pro" content
        console.log('Subscribed!');
        props.navigation.goBack();
      }
    } catch (e) {
      console.log(e);
      if (!e.userCancelled) {
        Alert.alert("Can't complete the subscription, please try again.");
      }
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.screen}>
        <View style={styles.topMessages}>
          <Text style={{fontSize: 16, color: Colors.primaryColor}}>
            {`Ads help me keep the app free.`}
          </Text>
          <Text
            style={{
              fontSize: 9,
              color: Colors.gray,
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
              borderRadius: 3,
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
            marginTop: 10,
            width: '80%',
            justifyContent: 'space-between',
          }}>
          <TouchableNativeFeedback
            onPress={onPurchaseHandler.bind(this, monthlyPackage)}>
            <View
              style={{
                ...styles.subscribeButton,
                ...{backgroundColor: Colors.gray},
              }}>
              <Text
                style={{
                  color: 'white',
                }}>{`${monthlyPackage.product.price_string} /month`}</Text>
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback
            onPress={onPurchaseHandler.bind(this, yearlyPackage)}>
            <View style={styles.subscribeButton}>
              <Text
                style={{
                  color: 'white',
                }}>{`${yearlyPackage.product.price_string} /year`}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text>TODO: restore</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  subscribeButton: {
    backgroundColor: Colors.primaryColor,
    height: 43,
    width: '48%',
    // marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default PayWallScreen;
