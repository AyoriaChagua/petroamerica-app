import AsyncStorage from '@react-native-async-storage/async-storage';

export const datastorage = () => {

    const setObjectValue = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@credencialesUsuario', jsonValue)
        return {respuesta: true}
      } catch(e) {
        return {error: 'Error al iniciar sesión, refresque la aplicación e intentelo nuevamente.'}
      }
    }

    const setTime = async (time) => {
      try {
        await AsyncStorage.setItem('@tiempoExpiracion', time)
        return {respuesta: true}
      } catch(e) {
        return {error: 'Error al iniciar sesión, refresque la aplicación e intentelo nuevamente.'}
      }
    
    }

    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('@credencialesUsuario')
          if(value !== null) {
            return {respuesta: JSON.parse(value)}
          }
          return {respuesta: false}
        } catch(e) {
          return {error: 'Error de información.'}
        }
    }

    const getTime = async () => {
      try {
        const value = await AsyncStorage.getItem('@tiempoExpiracion')
        if(value !== null) {
          return {respuesta: value}
        }
        return {respuesta: false}
      } catch(e) {
        return {error: 'Error de información.'}
      }
    }

    const clearAll = async () => {
        try {
          await AsyncStorage.clear()
          return {respuesta: true}
        } catch(e) {
          return {error: 'Problemas al elminar el storage'}
        }
    }

    return {
      setObjectValue,
      getData,
      setTime,
      getTime,
      clearAll
    }
}  