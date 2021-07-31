import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Colors from '../constants/Colors';
import {Button} from 'react-native-elements';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RecipeHomeScreen from '../screens/recipeScreens/RecipeHomeScreen';
import MainRecipeListScreen from '../screens/recipeScreens/MainRecipeListScreen';
import OneIngredientRecipeListScreen from '../screens/recipeScreens/OneIngredientRecipeListScreen';
import RecipeViewerScreen from '../screens/recipeScreens/RecipeViewerScreen';
import RecipeSearchScreen from '../screens/recipeScreens/RecipeSearchScreen';
import CategoryRecipeListScreen from '../screens/recipeScreens/CategoryRecipeListScreen';
import ImageHeader from '../components/ImageHeader';

const RecipeStackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <HeaderButtons style={{alignItems: 'center'}}>
            <Button
              title="Support"
              titleStyle={{
                color: 'white',
                fontSize: 16,
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
      }}>
      <Stack.Screen
        name="RecipeHome"
        component={RecipeHomeScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: () => (
            <ImageHeader />
          ),
        }}
      />
      <Stack.Screen
        name="FindRecipes"
        component={MainRecipeListScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'Find Recipes',
        }}
      />
      <Stack.Screen
        name="OneIngRecipes"
        component={OneIngredientRecipeListScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: '',
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

      <Stack.Screen
        name="CategoryRecipes"
        component={CategoryRecipeListScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: '',
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

      <Stack.Screen
        name="SearchRecipe"
        component={RecipeSearchScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'Search Recipe',
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
