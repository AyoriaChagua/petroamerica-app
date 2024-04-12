import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { tokenContext } from '../context/Context';
import Http from '../api/Http';
import { Alert } from 'react-native';
export const useListaClientes = () => {

    const [listaClientes1, setListaClientes] = useState([])
    const [listaClientes15, setListaClientes15] = useState([])
    const [nombreCliente, setNombreCliente] = useState('')
    const [cargarResultados, setCargarResultado] = useState(true)
    const navigation = useNavigation();
    const {token, ingresarContextCliente, tipoListaCliente} = useContext(tokenContext)
    const isMountedRef = useRef(null);

    useEffect(() => {
      isMountedRef.current = true;
      const listar = async () =>{
        const resListaClientes = await Http.listaClientesActuales(token)
        if(resListaClientes.error){
          Alert.alert('Mensaje', resListaClientes.error)
          return
        }
        resListaClientes.map(value => value.search = `${value.id_cliente}${value.nro_di}${value.descripcion}`)
        setListaClientes(resListaClientes)
      }
      listar()
      return () => isMountedRef.current = false;
    }, [])

    useEffect(() => {
      if(listaClientes1.length > 0){
        listar15Clientes('a')
      }
    }, [listaClientes1])
    

    const buscarCliente = texto =>{
      setNombreCliente(texto)
      listar15Clientes(texto)
    }

    const listar15Clientes = (texto) =>{
      let nuevaLista = []
      let listaCliente = listaClientes1
      for (let index = 0; index < listaCliente.length; index++) {
          if(listaCliente[index].search.indexOf(texto.toUpperCase()) !== -1){
            if(nuevaLista.length < 10){
              nuevaLista.push(listaCliente[index])
              }else{
                break
              }
          }
        }
        setListaClientes15(nuevaLista)
        setCargarResultado(false)
    }
    
    const irDetalleLClientes = (valores) =>{
      ingresarContextCliente(valores)
      if(tipoListaCliente === 1){
        navigation.navigate('DescuentosClienteScreen', valores)
      }else{
        navigation.navigate('InfoClienteScreen', valores)
      }
    }

  return {
    listaClientes15,
    nombreCliente,
    cargarResultados,
    buscarCliente,
    irDetalleLClientes,
  }
}
