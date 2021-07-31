import React from 'react';
import {Text, View, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createStackNavigator} from '@react-navigation/stack';
import Colors from '../constants/Colors';
import PantryScreen from '../screens/pantryScreens/PantryScreen';
import MyPantryScreen from '../screens/pantryScreens/MyPantryScreen';
import ImageHeader from '../components/ImageHeader';
import PayWallScreen from '../components/PayWallScreen';

const PantryStackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PantryHome"
        component={PantryScreen}
        options={({navigation}) => ({
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: () => <ImageHeader />,
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
                icon={
                  <Ionicons name="ellipsis-vertical" size={20} color="white" />
                }
                type="clear"
              />
            </HeaderButtons>
          ),
        })}
      />
      {/* TODO remove this later */}
      <Stack.Screen
        name="MyPantry"
        component={MyPantryScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'My Pantry',
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
        name="PayWall"
        component={PayWallScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryColor},
          headerTitle: 'Support the app'
        }}
      />
    </Stack.Navigator>
  );
};

export default PantryStackNavigator;
