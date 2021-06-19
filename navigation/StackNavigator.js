import React from 'react';
import {Button} from 'react-native-elements';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Colors from '../constants/Colors';

import BottomTabNavigator from './BottomTabNavigator';

const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions>
        <Stack.Screen
          name="WiseCook"
          component={BottomTabNavigator}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: Colors.primaryColor},
            headerRight: () => (
              <HeaderButtons>
                <Button
                  title="Remove Ads"
                  titleStyle={{color: 'white'}}
                  type="clear"
                />
                <Button
                  icon={
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color="white"
                    />
                  }
                  type="clear"
                />
              </HeaderButtons>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
