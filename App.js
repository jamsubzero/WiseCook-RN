import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import Purchases from 'react-native-purchases';

import {
  Appodeal,
  AppodealAdType,
  AppodealBanner,
  AppodealBannerEvent,
} from 'react-native-appodeal';
import Preferences from './constants/Preferences';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [isDisplayBanner, setIsDisplayBanner] = useState(false);
  const adTypes = AppodealAdType.INTERSTITIAL | AppodealAdType.BANNER;

  const initIfNeeded = async () => {
    try {
      const purchaserInfo = await Purchases.getPurchaserInfo();
      if (typeof purchaserInfo.entitlements.active[Preferences.ENTITLEMENT_ID] !== 'undefined') {
        console.log("The user is Pro, DON'T display banner!");
        setInitializing(false);
        return;
      }
    } catch (e) {
      console.log("Error fetching purchaser info");
    }

    console.log(initializing);
    if (!initializing) {
      return;
    }

    Appodeal.setTesting(true);
    Appodeal.disableLocationPermissionCheck();
    Appodeal.disableWriteExternalStoragePermissionCheck();
    Appodeal.initialize(Preferences.APPODEAL_APP_ID, adTypes, true);
    Appodeal.addEventListener(AppodealBannerEvent.LOADED, event => {
      console.log(
        'Banner loaded. Height: ',
        event.height + ', precache: ' + event.isPrecache,
      );
      Appodeal.show(AppodealAdType.BANNER_BOTTOM);
      setIsDisplayBanner(true);
    });
    Appodeal.addEventListener(AppodealBannerEvent.FAILED_TO_LOAD, () =>
      setIsDisplayBanner(false),
    );
    setInitializing(false);
  };

  // useEffect(() => {
  //   initIfNeeded();
  // }, [initializing]);

  useEffect(() => {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup(Preferences.REVENUE_CAT_API_KEY);
    Purchases.addPurchaserInfoUpdateListener(purchaserInfo => {
      if (
        typeof purchaserInfo.entitlements.active[Preferences.ENTITLEMENT_ID] !==
        'undefined'
      ) {
        console.log('Listened: Subscribed!');
        setIsDisplayBanner(false);
        Appodeal.hide(AppodealAdType.BANNER_BOTTOM);
      }
    });

    initIfNeeded();

    return () => {
      Purchases.removePurchaserInfoUpdateListener();
    };
  }, []);

  return (
    <View style={styles.screen}>
      <BottomTabNavigator />
      {isDisplayBanner ? (
        <View style={{height: 55, backgroundColor: 'white'}} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
