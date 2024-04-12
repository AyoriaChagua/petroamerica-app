import { useNavigation, DrawerActions } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import {helpers} from '../helpers/helpers'

export const Header = ({titulo, tipoMenu, botonDerecha = undefined, tituloCompleto = false}) => {

    const navigation = useNavigation();
    const {ResponsiveFont} = helpers()
    return (
        <View style={{flexDirection:'row', height:50, borderBottomColor:'#ebebeb', borderBottomWidth:1, backgroundColor:'#325288'}}>
            <View style={{flex:1, justifyContent:'center'}}>
            {
                tipoMenu === 'stack' 
                    ?   <Button icon="keyboard-backspace" labelStyle={{fontSize:22}} mode='text' compact={true} style={{alignItems:'flex-start'}} color='white' 
                            onPress={()=>{ navigation.goBack() }}
                        />
                    :   <Button icon="menu" labelStyle={{fontSize:22}} mode='text' compact={true} style={{alignItems:'flex-start'}} color='white' 
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        />
            }
            
            </View>
            <View style={{flex:7, justifyContent:'center'}}>
                <Text   numberOfLines={1} style={{textAlign:'center', fontSize:ResponsiveFont(15), color:'white'}}>
                    {(tituloCompleto) ? titulo : titulo.substring(0,25) }
                </Text>
            </View>
            <View style={{flex:1, justifyContent:'center'}}>
                {
                    botonDerecha && <Button icon="filter"  labelStyle={{fontSize:20}} mode='text' compact={true} style={{alignItems:'flex-start'}} color='white'   
                                        onPress={() => {botonDerecha()}}/>
                }
            </View>
        </View>
    )
}
