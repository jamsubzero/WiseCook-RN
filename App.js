import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import Purchases from 'react-native-purchases';

import {
  Appodeal,
  AppodealAdType,
  AppodealBannerEvent,
  AppodealBanner,
} from 'react-native-appodeal';
import Preferences from './constants/Preferences';

const App = () => {
  const [initializingAds, setInitializingAds] = useState(true);
  const [purchasesInitialized, setPurchasesInitialized] = useState(false);
  const [isDisplayBanner, setIsDisplayBanner] = useState(false);
  const [isASubscriber, setIsASubscriber] = useState(false);
  const adTypes = AppodealAdType.INTERSTITIAL | AppodealAdType.BANNER;

  const initializeAds = async () => {
    if (isASubscriber) {
      console.log('No need to initialize Ads, this is a subscriber');
      return;
    }

    if (!initializeAds) {
      console.log('Ads already initialized');
      return;
    }

    Appodeal.setTesting(true);
    Appodeal.disableLocationPermissionCheck();
    Appodeal.disableWriteExternalStoragePermissionCheck();
    Appodeal.setTabletBanners(false);
    Appodeal.initialize(Preferences.APPODEAL_APP_ID, adTypes, true);

    Appodeal.addEventListener(AppodealBannerEvent.LOADED, event => {
      console.log(
        'Banner loaded. Height: ',
        event.height + ', precache: ' + event.isPrecache,
      );
    });

    Appodeal.addEventListener(AppodealBannerEvent.FAILED_TO_LOAD, () => {
      setIsDisplayBanner(false);
      Appodeal.hide(AppodealAdType.BANNER_BOTTOM);
    });

    setInitializingAds(false);
  };

  useEffect(() => {
    if (!initializingAds && purchasesInitialized && !isASubscriber) {
      Appodeal.show(AppodealAdType.BANNER_BOTTOM);
      setIsDisplayBanner(true);
    }
  }, [initializingAds]);

  useEffect(() => {
    if (isASubscriber) {
      Appodeal.hide(AppodealAdType.BANNER_BOTTOM);
      setIsDisplayBanner(false);
    } else {
      if (purchasesInitialized) {
        initializeAds();
      }
    }
  }, [isASubscriber, purchasesInitialized]);

  const determineSubscription = async () => {
    try {
      const purchaserInfo = await Purchases.getPurchaserInfo();
      console.log(purchaserInfo);
      if (
        typeof purchaserInfo.entitlements.active[Preferences.ENTITLEMENT_ID] !==
        'undefined'
      ) {
        console.log("The user is Pro, DON'T display banner!");
        setIsASubscriber(true);
        return;
      } else {
        console.log('Not subscribed!');
      }
      setPurchasesInitialized(true);
    } catch (e) {
      console.log('Error fetching purchaser info');
    }
  };

  useEffect(() => {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup(Preferences.REVENUE_CAT_API_KEY);
    Purchases.addPurchaserInfoUpdateListener(purchaserInfo => {
      if (
        typeof purchaserInfo.entitlements.active[Preferences.ENTITLEMENT_ID] !==
        'undefined'
      ) {
        console.log('Listened: Subscribed!');
        console.log(purchaserInfo);

        setIsASubscriber(true);
      }
    });

    determineSubscription();

    return () => {
      Purchases.removePurchaserInfoUpdateListener();
    };
  }, []);

  return (
    <View style={styles.screen}>
      <BottomTabNavigator />
      {isDisplayBanner && !isASubscriber ? (
        <AppodealBanner
          style = {styles.banner}
          adSize ='phone'
          onAdLoaded = {() => console.log('Banner view did load')}
          onAdExpired = {() => console.log('Banner view expired')}
          onAdClicked = {() => console.log('Banner view is clicked')}
          onAdFailedToLoad = {() => console.log('Banner view is failed to load')}
          usesSmartSizing
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  banner: {
    marginTop: 5,
    height: 50,
    width: '100%',
    backgroundColor: 'hsl(0, 0%, 97%)',
    alignContent: 'stretch',
  },
});

export default App;
