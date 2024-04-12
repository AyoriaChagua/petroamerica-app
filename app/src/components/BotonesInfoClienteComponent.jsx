import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-paper'
import { IndicadorDeCarga } from './IndicadorDeCarga'
import { helpers } from '../helpers/helpers';

export const BotonesInfoClienteComponent = ({cargandoInfo, titulo, cantidad, icono, color, accionBoton, parametro}) => {

    const {ResponsiveFont} = helpers()

  return (
    <>
        {
            (cargandoInfo)
                ?
                    <TouchableOpacity onPress={()=> accionBoton(parametro, titulo)} style={styles.container}>
                        <View style={{alignItems:'center'}}>
                            <Avatar.Icon size={25} icon="table" style={{backgroundColor:'transparent'}} color='gray'/>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{textAlign:'center', fontSize: ResponsiveFont(12)}}>{titulo}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{textAlign:'center', fontWeight:'bold', fontSize: ResponsiveFont(16)}}>{cantidad}</Text>
                            <Avatar.Icon size={ResponsiveFont(40)} icon={icono} style={{backgroundColor:'transparent'}} color={color}/>
                        </View>
                    </TouchableOpacity>
                :
                    <View style={{...styles.container,justifyContent:'center', alignItems:'center'}}>
                        <IndicadorDeCarga height={100} size={20} />
                    </View>
        }
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        height:150, 
        backgroundColor:'#f2f9ff', 
        borderWidth:1, 
        borderColor:'#e9e9e9', 
        margin:10, 
        padding:5,
        borderRadius:5
    }
})