import React, {useContext, useEffect, useState} from 'react';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import { DescuentosClienteScreen } from '../screen/DescuentosClienteScreen';
import { InfoClienteScreen } from '../screen/InfoClienteScreenX';
import { tokenContext } from '../context/Context';
import { ButtonNavegation } from '../components/ButtonNavegation';
import {useNavigate} from '../hooks/useNavigate'
const Drawer = createDrawerNavigator();

export const DrawerCliente = (props) =>  { 
   
  const {tipoUsuario} = useContext(tokenContext)
  const {validarTiempoExpiracion} = useNavigate(props)
  useEffect(() => {
    validarTiempoExpiracion()
  }, [])

  return (
    <Drawer.Navigator
    initialRouteName='DescuentosClienteScreen'
        screenOptions={{
            headerShown: false,
            headerStyle:{
                elevation:0,
                shadowColor:'transparent'
            },
            sceneContainerStyle:{
                backgroundColor:'white'
            }
        }}
        drawerContent={ (props) => <MenuLateral { ...props } tipoUsuario={tipoUsuario}/> }
    >
      {
        (tipoUsuario === '1' || tipoUsuario === '2')
          ? 
         ( <>
            <Drawer.Screen name="DescuentosClienteScreen" component={DescuentosClienteScreen} options={{swipeEnabled:false}} />
            <Drawer.Screen name="InfoClienteScreen" component={InfoClienteScreen}  options={{swipeEnabled:false}}/>
          </>)
          : 
            (<Drawer.Screen name="InfoClienteScreen" component={InfoClienteScreen} options={{swipeEnabled:false}} />)
      }
    </Drawer.Navigator>
  )
  
}

const MenuLateral = (props) => {
  const {navigation, tipoUsuario} = props
  return (
    <DrawerContentScrollView>

      <View style={ styles.avatarContainer }>
        <Image source={require("../img/logoP.jpg")} style={ styles.avatar } />
      </View>

      <View style={ styles.menuContainer }>
          <ButtonNavegation nombre='Registro de Descuentos' ruta={() => navigation.navigate('DescuentosClienteScreen')} icono = 'pencil' esVisible={(tipoUsuario < 1) ? true : false}/>
          <ButtonNavegation nombre='Información' ruta={() =>  navigation.navigate('InfoClienteScreen')} icono = 'information-outline'/>
          <ButtonNavegation nombre='Cliente información' ruta={() => navigation.dispatch(StackActions.pop(1))} icono = 'keyboard-return'/>
       

      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
      alignItems: 'center',
      marginTop: 20
  },
  avatar: {
      width: 120,
      height: 120,
      borderRadius: 100
  },
  menuContainer: {
      marginVertical: 30,
      marginHorizontal: 30
  }
});