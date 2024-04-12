import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper';
import { helpers } from '../helpers/helpers';

export const ButtonNavegation = ({ruta, nombre, icono, esVisible = false}) => {
    const {ResponsiveFont} = helpers()
  return (
    <TouchableOpacity style={styles.boton} onPress={ruta} disabled={esVisible}>
        <Avatar.Icon size={ResponsiveFont(30)} icon={icono} color={(!esVisible) ? '#2155CD' : 'grey'} style={styles.icono}/>
        <Text style={{fontSize: ResponsiveFont(15), color:(!esVisible) ? 'black' : 'grey'}}>{nombre}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    boton: {
        marginTop: 10,
        alignItems:'center', 
        flexDirection: 'row'
    },
    icono:{
        backgroundColor:'transparent'
    }
})