import React from 'react';
import {Button} from 'react-native-elements';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createStackNavigator} from '@react-navigation/stack';
import Colors from '../constants/Colors';
import PantryScreen from '../screens/pantryScreens/PantryScreen';
import DictateIngredientsScreen from '../screens/pantryScreens/DictateIngredientsScreen';

const PantryStackNavigator = () => {
  const Stack = createStackNavigator();
  return (
  
      <Stack.Navigator >
        <Stack.Screen
          name="PantryHome"
          component={PantryScreen}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: Colors.primaryColor},
            headerTitle: 'WiseCook',
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
        <Stack.Screen
          name="DictateIngredients"
          component={DictateIngredientsScreen}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: Colors.primaryColor},
            headerTitle: 'Dictate ingredients',
            headerRight: () => (
              <HeaderButtons style={{alignItems: 'center'}}>
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

export default PantryStackNavigator;
