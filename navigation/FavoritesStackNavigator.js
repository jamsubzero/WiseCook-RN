import React from 'react';
import {Button} from 'react-native-elements';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createStackNavigator} from '@react-navigation/stack';

import Colors from '../constants/Colors';
import FavoritesScreen from '../screens/favoritesScreens/FavoritesScreen';

const FavoritesStackNavigator = () => {
  const Stack = createStackNavigator();
  return (
  
      <Stack.Navigator >
        <Stack.Screen
          name="FavoriteList"
          component={FavoritesScreen}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: Colors.primaryColor},
            headerTitle: 'Favorites',
            headerRight: () => (
              <HeaderButtons style={{alignItems: 'center'}}>
                <Button
                  title="Remove Ads"
                  titleStyle={{
                    color: 'white',
                    fontSize: 13,
                    alignContent: 'center',
                  }}
                  buttonStyle={{paddingTop: 10}}
                  type="clear"
                />
                <Button
                  icon={
                    <Ionicons name="ellipsis-vertical" size={20} color="white" />
                  }
                  type="clear"
                />
              </HeaderButtons>
            ),
          }}
        />  
      </Stack.Navigator>
  );
};

export default FavoritesStackNavigator;
