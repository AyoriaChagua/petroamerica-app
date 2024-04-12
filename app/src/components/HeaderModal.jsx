import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import { helpers } from '../helpers/helpers'

export const HeaderModal = ({titulo, cerrarModal, botonEfeact = false}) => {
    const {ResponsiveFont} = helpers()
    return (
        <View style={styles.viewContainer}>{/*Documentos del mes: {titulo}*/}
            <Text style={{ ...styles.textTitulo, fontSize:ResponsiveFont(13)}}>{titulo}</Text>
            {
                (botonEfeact) &&
                    (<TouchableOpacity onPress={()=> Linking.openURL('https://web.efact.pe/login')}>
                        <Image source={require("../img/logoEfact.png")} style={{resizeMode:'center', width:30, height:30, borderRadius:5}} />
                    </TouchableOpacity>)
            }

            <TouchableOpacity style={styles.boton} onPress={cerrarModal}>
                <Text style={{...styles.botonX,fontSize:ResponsiveFont(12)}}>x</Text>                                
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection:'row',
        justifyContent:'space-between', 
        alignItems:'center', 
        //paddingHorizontal:20, 
        marginBottom:10
    },
    textTitulo: {
        fontWeight:'bold'
    },
    boton: {
        paddingVertical:2, 
        paddingHorizontal:7, 
        borderWidth: 2, 
        borderColor:'#325288', 
        borderRadius:5, 
        alignItems:'center'
    },
    botonX:{
        fontWeight:'bold', 
        color:'#325288'
    }
})