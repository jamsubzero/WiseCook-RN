import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

import Colors from '../constants/Colors';

import ShoppingListScreen from '../screens/ShoppingListScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

import PantryStackNavigator from './PantryStackNavigator';
import RecipeStackNavigator from './RecipeStackNavigator';

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let iconType;

            // 'focused' can be use to have icon conditionally (like outline or not)

            if (route.name === 'Pantry') {
              iconName = 'carrot';
              iconType = 'font-awesome-5';
            } else if (route.name === 'Recipe') {
              iconName = 'chef-hat';
              iconType = 'material-community';
            } else if (route.name === 'Shopping List') {
              iconName = 'shopping-cart';
              iconType = 'material';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart-multiple' : 'heart-multiple-outline';
              iconType = 'material-community';
            }

            return (
              <Icon name={iconName} size={size} color={color} type={iconType} />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: Colors.primaryColor,
          inactiveTintColor: Colors.gray,
        }}>
        <Tab.Screen name="Pantry" component={PantryStackNavigator} />
        <Tab.Screen
          name="Recipe"
          component={RecipeStackNavigator}
          initialParams={{isGo: false}}
        />
        <Tab.Screen name="Shopping List" component={ShoppingListScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
