import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Linking
} from 'react-native';
import Purchases from 'react-native-purchases';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Appodeal, AppodealAdType} from 'react-native-appodeal';

import Card from './Card';
import Colors from '../constants/Colors';
import Preferences from '../constants/Preferences';

const PayWallScreen = props => {
  const [monthlyPackage, setMonthlyPackage] = useState('');
  const [yearlyPackage, setYearlyPackage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isASubscriber, setIsASubscriber] = useState(false);

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
      const purchaserInfo = await Purchases.getPurchaserInfo();
      console.log(purchaserInfo);
      if (
        typeof purchaserInfo.entitlements.active[Preferences.ENTITLEMENT_ID] !==
        'undefined'
      ) {
        console.log("The user is Pro, DON'T display subscription BUTTONS!");
        setIsLoading(false);
        setIsASubscriber(true);
        return;
      }

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

  if (!isASubscriber && (!monthlyPackage || !yearlyPackage)) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

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
      if (
        typeof purchaseMade.purchaserInfo.entitlements.active[
          Preferences.ENTITLEMENT_ID
        ] !== 'undefined'
      ) {
        ToastAndroid.show(`Subscription successful`, ToastAndroid.SHORT);
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

  const restorePurchaseHandler = async () => {
    try {
      const restoredPurchaserInfo = await Purchases.restoreTransactions();
      if (
        typeof restoredPurchaserInfo.entitlements.active[
          Preferences.ENTITLEMENT_ID
        ] !== 'undefined'
      ) {
        Appodeal.hide(AppodealAdType.BANNER_BOTTOM);
        console.log('Restored Subscription!');
        ToastAndroid.show(`Subscription Restored`, ToastAndroid.SHORT);
        props.navigation.goBack();
      }
    } catch (e) {
      console.log(e);
      Alert.alert("That didn't work, please try again.");
    }
  };

  const manageSubscriptionHandler = () => {
    Linking.openURL(`https://play.google.com/store/account/subscriptions`);
  }

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.screen}>
        {isASubscriber ? (
          <View style={styles.topMessages}>
            <Text
              style={
                styles.titleText
              }>{`Thank you for supporting WiseCook.`}</Text>
          </View>
        ) : (
          <View style={styles.topMessages}>
            <Text style={styles.titleText}>
              {`Ads help me keep the app free.`}
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: Colors.gray,
                textAlign: 'center',
              }}>
              {`No one likes ads, I hate it too. However, it takes money to keep the app running, ads help me pay the bills.`}
            </Text>
          </View>
        )}

        <Card style={styles.cardStyle}>
          <View style={styles.cardTitle}>
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
        {isASubscriber ? null : (
          <View style={styles.subscribeButtonsContainer}>
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
        )}

        {isASubscriber ? (
          <View style={styles.bottomRestoreMessage}>
            <TouchableOpacity onPress={manageSubscriptionHandler}>
              <Text style={styles.linkedText}>{`Manage subscriptions`}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bottomRestoreMessage}>
            <TouchableOpacity onPress={restorePurchaseHandler}>
              <Text>
                <Text
                  style={{
                    color: Colors.primaryColor,
                  }}>{`Already a supporter?  `}</Text>
                <Text style={styles.linkedText}>{`Restore`}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    alignItems: 'center',
    width: '80%',
  },
  titleText: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  cardTitle: {
    marginBottom: 10,
    backgroundColor: '#cccccc',
    borderRadius: 3,
    paddingLeft: 5,
    paddingVertical: 7,
  },
  cardStyle: {
    width: '80%',
    borderRadius: 5,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  subscribeButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: '80%',
    justifyContent: 'space-between',
  },
  subscribeButton: {
    backgroundColor: Colors.primaryColor,
    height: 43,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  bottomRestoreMessage: {
    marginTop: 30,
  },
  linkedText: {
    color: Colors.blue,
    textDecorationLine: 'underline',
  },
});

export default PayWallScreen;
