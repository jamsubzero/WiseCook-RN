import React from 'react';
import {Button} from 'react-native-elements';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createStackNavigator} from '@react-navigation/stack';

import Colors from '../constants/Colors';
import FavoritesScreen from '../screens/favoritesScreens/FavoritesScreen';
import RecipeViewerScreen from '../screens/recipeScreens/RecipeViewerScreen';
import ImageHeader from '../components/ImageHeader';
import PayWallScreen from '../components/PayWallScreen';
import AboutScreen from '../components/AboutScreen';

const FavoritesStackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerRight: () => (
          <HeaderButtons style={{alignItems: 'center'}}>
            <Button
              onPress={() => navigation.navigate('PayWall')}
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
              onPress={() => navigation.navigate('About')}
              icon={
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
              }
              type="clear"
            />
          </HeaderButtons>
        ),
      })}>
      <Stack.Screen
        name="FavoriteList"
        component={FavoritesScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: () => <ImageHeader />,
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
      <Stack.Screen
        name="PayWall"
        component={PayWallScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'Support the app',
          headerRight: null,
        }}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'About',
          headerRight: null,
        }}
      />
    </Stack.Navigator>
  );
};

export default FavoritesStackNavigator;
