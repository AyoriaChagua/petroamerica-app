import React, { useEffect } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screen/LoginScreen';
import {DrawerNavigation} from './DrawerNavigation';

const Stack = createStackNavigator();

export const MyStack = () =>{

  return (
    <Stack.Navigator
    
    screenOptions={{
      headerShown: false,
      headerStyle:{
        elevation:0,
        shadowColor:'transparent'
      },
      cardStyle:{
        backgroundColor:'white'
      }
    }}

    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
    </Stack.Navigator>
  )
  
}