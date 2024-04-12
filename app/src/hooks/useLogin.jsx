import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Http from '../api/Http';
import { tokenContext } from '../context/Context';
import { Alert, Linking } from 'react-native';
import {datastorage} from '../helpers/storage'
import moment from 'moment';
//import * as Linking from 'expo-linking';
export const useLogin = () => {

  const [camposLogin, setCamposLogin] = useState({id_usuario: '', Pass_word: '', id_celular:'123'})
  const [helpers, setHelpers] = useState({usuario: 'none', password: 'none'})
  const [estadoCargaGrabar, setEstadoCargaGrabar] = useState(false)
  const [validandoToken, setValidandoToken] = useState(true)

  const {ingresarContextAuth} = useContext(tokenContext)
  const navigation = useNavigation();
  const isMountedRef = useRef(null)
  const {getData, getTime, setTime, setObjectValue, clearAll} = datastorage()

  useEffect(() => {
    isMountedRef.current = true;
    validarToken()
    return () => isMountedRef.current = false
  }, [])
  
  const agregarCredenciales = (e, name) =>{
    setCamposLogin({...camposLogin, [name]: e})
  }

  const validarLogin = async () =>{
    //await Linking.openURL("appdescuentot://Login/123")
    //return
    if(camposLogin.id_usuario == ''){
      setHelpers({usuario: 'flex', password: 'none'})
      return
    }
    if(camposLogin.Pass_word == ''){
        setHelpers({usuario: 'none', password: 'flex'})
        return
    }
    setHelpers({usuario: 'none', password: 'none'})
    setEstadoCargaGrabar(true)
    let resLogin = await Http.login(camposLogin)
    if(resLogin.error){ 
      setCamposLogin({...camposLogin, 'Pass_word': ''})
      setEstadoCargaGrabar(false)
      return
    }
    if(resLogin.status){ 
      setCamposLogin({...camposLogin, 'Pass_word': ''})
      setEstadoCargaGrabar(false)
      Alert.alert('Mensaje', 'Usuario no registrado.')
      return
    }
    console.log(resLogin)
    await setTime(moment().format())
    await setObjectValue({token: resLogin.token, id_usuario: camposLogin.id_usuario, tipoUsuario: resLogin.aprueba_dscto})
    ingresarContextAuth(resLogin.token, camposLogin.id_usuario, resLogin.aprueba_dscto)
    setCamposLogin({...camposLogin, 'Pass_word': ''})
    setEstadoCargaGrabar(false)
    navigation.navigate('DrawerNavigation')
  }

  const validarToken = async () => {
    setValidandoToken(true)
    let respuesta = await getData()
    let tiempoDeInicio = await getTime()
    if(respuesta.error || !respuesta.respuesta || tiempoDeInicio.error || !tiempoDeInicio.respuesta) {
      setValidandoToken(false)
      return
    }

    let fechaI = tiempoDeInicio.respuesta
    if(moment().diff(fechaI, 'hours') > 13){
      navigation.navigate('LoginScreen')
      await clearAll()
      setValidandoToken(false)
      return
    }
    const {respuesta:detalle} = respuesta
    ingresarContextAuth(detalle.token, detalle.id_usuario, detalle.tipoUsuario)
    navigation.navigate('DrawerNavigation')
    setValidandoToken(false)
  }

  return {
    camposLogin,
    helpers,
    estadoCargaGrabar,
    validandoToken,
    agregarCredenciales,
    validarLogin
  }
}
