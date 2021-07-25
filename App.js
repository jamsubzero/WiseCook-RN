import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';

import {
  Appodeal,
  AppodealAdType,
  AppodealBanner,
  AppodealBannerEvent,
} from 'react-native-appodeal';
import IAP from 'react-native-iap';

const subSkus = ['wisecook_399_1m'];

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(50);
  const adTypes = AppodealAdType.INTERSTITIAL | AppodealAdType.BANNER;
  const consent = true;

  const APPODEAL_APP_ID = '37fd8add4ddea78c3d18f3148ded9e422ac435a143e99dd9';

  useEffect(() => {
    function initIfNeeded() {
      console.log(initializing);
      if (!initializing) {
        return;
      }

      Appodeal.setTesting(true);
      Appodeal.disableLocationPermissionCheck();
      Appodeal.disableWriteExternalStoragePermissionCheck();
      Appodeal.initialize(APPODEAL_APP_ID, adTypes, consent);
      setInitializing(false);
      setInitialized(true);
      Appodeal.show(AppodealAdType.BANNER);
    }
    initIfNeeded();
  }, [initializing]);

  useEffect(() => {
    IAP.initConnection()
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
        IAP.getSubscriptions(subSkus)
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            console.log("finding subscriptions");
           console.log(res);
          });
      });

    Appodeal.addEventListener(AppodealBannerEvent.LOADED, event => {
      console.log(
        'Banner loaded. Height: ',
        event.height + ', precache: ' + event.isPrecache,
      );
      setIsBannerLoaded(true);
    });
    Appodeal.addEventListener(AppodealBannerEvent.FAILED_TO_LOAD, () =>
      setIsBannerLoaded(false),
    );
  }, []);

  return (
    <View style={styles.screen}>
      <BottomTabNavigator />
      {isBannerLoaded ? (
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
