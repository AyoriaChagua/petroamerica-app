import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View, Image, Dimensions, StatusBar} from 'react-native'
import { HelperText, Button, TextInput } from 'react-native-paper';
import { useLogin } from '../hooks/useLogin';
import { IndicadorDeCarga } from '../components/IndicadorDeCarga';

export const LoginScreen = () => {

    const {camposLogin, helpers, estadoCargaGrabar, validandoToken, agregarCredenciales, validarLogin} = useLogin()
    
    return (
        <SafeAreaView style={{flex:1}}>            
            <StatusBar translucent backgroundColor="#1C6DD0" barStyle="light-content"/>
            <View style={{backgroundColor:'#1C6DD0', padding:9, zIndex:10}}>
                <Text style={styles.textoTitulo}>PETROAMERICA</Text>
            </View>
            <ScrollView disableScrollViewPanResponder={true} style={{flex:1}}>
                <View style={styles.imagen}>
                    <Image source={require("../img/logoP.jpg")} style={styles.img} />
                </View>
                {
                    (validandoToken)
                        ?   <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <IndicadorDeCarga height={200} size={20}/>
                            </View>
                        :   <View style={styles.formulario}>
                                <Text style={styles.textoLogo1}>Bienvenido</Text>
                                <TextInput
                                    dense={true}
                                    label="Usuario"
                                    style={styles.propiedadCajaTexto}
                                    underlineColor='#1C6DD0'
                                    activeUnderlineColor='#1C6DD0'
                                    outlineColor='#1C6DD0'
                                    activeOutlineColor='#1C6DD0'
                                    selectionColor='#1C6DD0'
                                    value={camposLogin.id_usuario}
                                    onChangeText={(e)=> {agregarCredenciales(e, 'id_usuario')} }
                                    left={<TextInput.Icon name="account" color='gray' style={{marginRight:10}}/>}
                                />
                                <View style={{marginHorizontal:20,display:helpers.usuario}}>
                                    <HelperText type="error" visible={true} padding='none'>Debe ingresar un usuario</HelperText>
                                </View>
                                <View>
                                <TextInput
                                    dense={true}
                                    underlineColor='#1C6DD0'
                                    activeUnderlineColor='#1C6DD0'
                                    outlineColor='#1C6DD0'
                                    activeOutlineColor='#1C6DD0'
                                    selectionColor='#1C6DD0'
                                    style={styles.propiedadCajaTexto}
                                    label="Contraseña"
                                    secureTextEntry = {true}
                                    value={camposLogin.Pass_word}
                                    onChangeText={(e)=> agregarCredenciales(e, 'Pass_word') }
                                    left={<TextInput.Icon name="lock" color='gray' style={{marginRight:10}}/>}
                                />
                                </View>
                                
                                <View style={{marginHorizontal:20, display:helpers.password}}>
                                    <HelperText type="error" visible={true} padding='none'  >Debe ingresar una contraseña</HelperText>
                                </View>
                                <Button 
                                    loading = {estadoCargaGrabar} 
                                    mode="outlined"  
                                    style={styles.propiedadesBoton}
                                    color='white'
                                    onPress={() => validarLogin()}>
                                    Acceder
                                </Button>
                                <Text style={{color:'#1C6DD0', textAlign:'center', marginTop:10}}>Derechos Reservados a Petroamerica</Text>
                                <Text style={{color:'#1C6DD0', textAlign:'center', fontSize: 11}}>Version 1.0.9</Text>
                            </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    backgroundColor:'white',
},
textoTitulo:{
    color:'white', 
    textAlign:'center', 
    fontSize:16,
    fontWeight:'700'
},
imagen: {
    justifyContent:'center', 
    alignItems:'center',
    //height:Dimensions.get('window').height/3
    height:200
},
img:{
    width:200,
    height:200,
    resizeMode:'stretch'
},
textoLogo1:{
    color:'#1C6DD0', 
    fontSize:20,
    fontWeight:'700',
    marginHorizontal:20
},
formulario:{
    backgroundColor:'#FFFDF9', 
    paddingTop:20, 
},
propiedadCajaTexto:{
    borderTopStartRadius:15,
    borderTopEndRadius:15,
    borderBottomEndRadius:15,
    borderBottomStartRadius:15,
    marginHorizontal:20,
    marginTop:20,
    backgroundColor:'#FFFDF9',
},
propiedadesBoton:{
    marginTop:20,
    marginHorizontal:20,
    padding:5,
    backgroundColor:'#1C6DD0'
},
colorTexto:{
    color:'red',
    textAlign:'center',
    fontSize:15,
    fontWeight:'bold'
},
containerStyle:{
    backgroundColor: 'white', 
    padding: 25,
    zIndex:5000,
    marginLeft: 15,
    marginRight: 15
},
propiedadesTextoModal:{
    textAlign:'center',
    alignItems:'center',
    fontSize:16,
    marginBottom:8,
    textTransform:'uppercase'
}
})