import React, { useContext } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { ScrollView, StatusBar } from 'react-native'
import { List, Searchbar } from 'react-native-paper';
import { useListaClientes } from '../hooks/useListaClientes';
import { Header } from '../components/Header';
import { IndicadorDeCarga } from '../components/IndicadorDeCarga';
import { helpers } from '../helpers/helpers';
import { tokenContext } from '../context/Context';

export const OrdenDePedidoScreen = () => {
    const {tipoListaCliente} = useContext(tokenContext)

    const {
      listaClientes15, 
      nombreCliente, 
      cargarResultados, 
      buscarCliente, 
      irDetalleLClientes} = useListaClientes()
  
      const {ResponsiveFont} = helpers()
    return(
    <SafeAreaView style={{flex:1}}>
      <StatusBar backgroundColor="#325288" />
        <Header titulo={(tipoListaCliente === 1) ? 'Ordenes de Compra': 'Ordenes de Compra'} tipoMenu={'drawer'} />
        
        <ScrollView disableScrollViewPanResponder={true}>
          {
              <Searchbar
              onChangeText={(text)=>buscarCliente(text) }
              style={{backgroundColor:'#EFEFEF', borderTopStartRadius:0, borderTopEndRadius:0}}
              iconColor='grey'
              inputStyle={{color:'black'}}
              value={nombreCliente}
            />
          }
        </ScrollView>
    </SafeAreaView>
    )
}