import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Colors from '../constants/Colors';
import {Button} from 'react-native-elements';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RecipeHomeScreen from '../screens/recipeScreens/RecipeHomeScreen';
import RecipeListScreen from '../screens/recipeScreens/RecipeListScreen';
import RecipeViewerScreen from '../screens/recipeScreens/RecipeViewerScreen';

const RecipeStackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <HeaderButtons>
            <Button
              title="Remove Ads"
              titleStyle={{color: 'white'}}
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
      }}>
      <Stack.Screen
        name="RecipeHome"
        component={RecipeHomeScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'WiseCook',
        }}
      />
      <Stack.Screen
        name="FindRecipes"
        component={RecipeListScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'Find Recipes',
        }}
      />
      <Stack.Screen
        name="ViewRecipe"
        component={RecipeViewerScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default RecipeStackNavigator;
