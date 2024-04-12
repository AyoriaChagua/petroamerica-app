import React from 'react'
import { Text, View } from 'react-native'
import {helpers} from '../helpers/helpers'

export const Descuento = (props) => {
    const {ResponsiveFont} = helpers()
    const {data, index} = props
  return (
    <View style={{flex:1, flexDirection:'column', justifyContent: 'space-evenly',alignItems: 'center'}}>
        <View style={{flexDirection:'row', paddingHorizontal:5}}>
            <View style={{flex:3, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <Text  style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{data.desc_planta || ''}</Text>
            </View>
            <View style={{flex:4, flexDirection:'row', justifyContent:'center', paddingHorizontal:10, alignItems:'center'}}>
                <Text  style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{data.desc_condicion_pago || ''}</Text>
            </View>
            <View style={{flex:3, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <Text  style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{data.desc_articulo || data.id_articulo_subclase || ''}</Text>
            </View>
        </View>
        <View style={{justifyContent:'space-around', flexDirection:'row'}}>
            <View style={{flex:4, alignItems:'center'}}>
                <Text  style={{fontSize:ResponsiveFont(12),textAlign:'center', padding:0, fontWeight:'700'}}>{data.factor_sin_igv || '0'}</Text>
            </View>
            <View style={{flex:4}}>
                <Text  style={{fontSize:ResponsiveFont(11),textAlign:'center'}}>{data.desc_almacen}</Text>
            </View>
            <View style={{flex:4, alignItems:'center'}}>
                <Text  style={{fontSize:ResponsiveFont(12),textAlign:'center', padding:0, fontWeight:'700'}}>{data.factor_con_igv || '0'}</Text>
            </View>
        </View>
    </View>
  )
}
