import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

export const IndicadorDeCarga = ({height, size}) => {
  return (
    <View style={{justifyContent:'center', alignItems:'center', height}}>
        <ActivityIndicator animating={true} color='black' size={size}/>
    </View>
  )
}
