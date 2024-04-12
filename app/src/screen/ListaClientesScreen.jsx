import React, { useContext } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { ScrollView, StatusBar } from 'react-native'
import { List, Searchbar } from 'react-native-paper';
import { useListaClientes } from '../hooks/useListaClientes';
import { Header } from '../components/Header';
import { IndicadorDeCarga } from '../components/IndicadorDeCarga';
import { helpers } from '../helpers/helpers';
import { tokenContext } from '../context/Context';

export const ListaClientesScreen = () => {

  const {tipoListaCliente} = useContext(tokenContext)

  const {
    listaClientes15, 
    nombreCliente, 
    cargarResultados, 
    buscarCliente, 
    irDetalleLClientes} = useListaClientes()

    const {ResponsiveFont} = helpers()
  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar backgroundColor="#325288" />
        <Header titulo={(tipoListaCliente === 1) ? 'Registro Descuentos': 'Clientes Información'} tipoMenu={'drawer'} />
        <Searchbar
          onChangeText={(text)=>buscarCliente(text) }
          style={{backgroundColor:'#EFEFEF', borderTopStartRadius:0, borderTopEndRadius:0}}
          iconColor='grey'
          inputStyle={{color:'black'}}
          value={nombreCliente}
        />
        <ScrollView disableScrollViewPanResponder={true}>
          {
              (cargarResultados)
                ? <IndicadorDeCarga height={300} size={18}/>
                : <List.Section style={{marginBottom:50}}>
                    <List.Subheader> {listaClientes15.length > 0 ? '15 primeros resultados: ' : 'No se encontraron resultados'} </List.Subheader>
                    {
                      listaClientes15.map(value => 
                        <List.Item titleNumberOfLines={2} style={{
                            borderRadius:8, 
                            marginVertical: 5, 
                            marginHorizontal: 10,
                            backgroundColor:'white',
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,
                            elevation: 1}} 
                          key={value.id_cliente} titleStyle={{fontSize:ResponsiveFont(13)}} title={value.descripcion} left={() => <List.Icon icon="account" color='#325288'/>}  
                          onPress= {(x)=>{irDetalleLClientes(value)}}
                        />
                      )
                    }
                  </List.Section>   
          }
        </ScrollView>
    </SafeAreaView>
  )
}
