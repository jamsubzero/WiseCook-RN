import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';

import Colors from '../constants/Colors';

import PantryScreen from '../screens/PantryScreen';
import RecipeScreen from '../screens/RecipeScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconType;

            // 'focused' can be use to have icon conditionally (like outline or not)

            if (route.name === 'Pantry') {
              iconName = 'carrot';
              iconType = 'font-awesome-5';
            } else if (route.name === 'Recipe') {
              iconName = 'chef-hat';
              iconType = 'material-community';
            } else if(route.name === 'Shopping List'){
               iconName = 'shopping-cart';
               iconType = 'material';
            } else if(route.name === 'Favorites'){
                iconName = focused ? 'heart-multiple' : 'heart-multiple-outline';
                iconType = 'material-community';
             }

            return <Icon name={iconName} size={size} color={color} type={iconType}/>;
          },
        })}
        tabBarOptions={{
          activeTintColor: Colors.primaryColor,
          inactiveTintColor: Colors.gray,
        }}
      >
        <Tab.Screen name="Pantry" component={PantryScreen} />
        <Tab.Screen name="Recipe" component={RecipeScreen} />
        <Tab.Screen name="Shopping List" component={ShoppingListScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
  );
};

export default BottomTabNavigator;
