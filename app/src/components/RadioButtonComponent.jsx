import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { helpers } from '../helpers/helpers'

export const RadioButtonComponent = ({texto, status, valor, checkFuncion}) => {
    const {ResponsiveFont} = helpers()
  return (
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <TouchableOpacity onPress={checkFuncion}>
        <View style={{height:22, width:22, borderRadius: 15, padding:5, alignItems:'center', justifyContent:'center', borderWidth:2.5, borderColor:'#35858B'}}>
          <View style={{width:10, height:10, backgroundColor:(status === valor) ? '#35858B' : 'white' , borderRadius:10}}></View>
        </View>
      </TouchableOpacity>
      <Text style={{marginLeft:7, fontSize:ResponsiveFont(12)}}>{texto}</Text>
    </View>
  )
}