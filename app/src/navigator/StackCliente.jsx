import React, { useEffect, useRef } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import {ListaClientesScreen} from '../screen/ListaClientesScreen';
import { DrawerCliente } from '../navigator/DrawerCliente';
import {useNavigate} from '../hooks/useNavigate'

const Stack = createStackNavigator();

export const StackCliente = (props) =>{
  
  const {validarTiempoExpiracion} = useNavigate(props)
  useEffect(() => {
    validarTiempoExpiracion()
  }, [])
  
  return (
    <Stack.Navigator
    initialRouteName='ListaClientesScreen'
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
      <Stack.Screen name="ListaClientesScreen" component={ListaClientesScreen} />
      <Stack.Screen name="DrawerCliente" component={DrawerCliente} />
    </Stack.Navigator>
  )
}