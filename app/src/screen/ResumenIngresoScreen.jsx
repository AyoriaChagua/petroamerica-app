import moment from 'moment'
import React from 'react'
import { Dimensions, FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { Avatar, Button, Divider, Modal, Portal, Provider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend } from 'victory-native'
import DateTimePiker from '@react-native-community/datetimepicker'

import { Header } from '../components/Header'
import { HeaderModal } from '../components/HeaderModal'
import { ModalComponent } from '../components/ModalComponent'
import { IndicadorDeCarga } from '../components/IndicadorDeCarga'
import { RadioButtonComponent } from '../components/RadioButtonComponent'
import { helpers } from '../helpers/helpers'
import { useResumenIngreso } from '../hooks/useResumenIngreso'
import stylesGlobal from '../theme/stylesGlobal'

export const ResumenIngresoScreen = () => {

  const {resumenVentas, filtro, verModalFiltro, tipoDeGrafico, verCargaGrafica, resumenVentasTabla, verTablaInicial, verCargaTabla,fechaInicialVisible,
    totalTabla,
    fechaFinalVisible,
    funcIniciarModalFiltro,
    funcOcultarModalFiltro,
    funcCambiarDatosFiltro,
    funcSeleccionarTipoGrafico,
    funcSeleccionarGrafico,
    abrirCalendarioInicial,
    abrirCalendarioFinal,
    funcCambiarFiltroFechaInicial,
    funcCambiarFiltroFechaFinal,
    funcAplicarFiltro} = useResumenIngreso()

  const {ResponsiveFont} = helpers()

  const BotonTipoGrafico = ({texto, grafico, tipoGrafico}) => {
    return (
      <TouchableOpacity onPress={() => {funcSeleccionarTipoGrafico(tipoGrafico)}}
        style={{padding:5, borderRadius:13, borderColor:(grafico === tipoGrafico) ? '#e8e8e8' : null, borderWidth:(grafico === tipoGrafico) ? 1 : 0, backgroundColor:(grafico === tipoGrafico) ? '#e8e8e8' : null}}>
        <Text style={{fontSize:ResponsiveFont(12), color:'#3367d6'}}>{texto}</Text>
      </TouchableOpacity>
    )
  }

  const renderItem = ({item}) => {
    return ( 
      <>
      <View style={{flexDirection:'row', paddingLeft:4, paddingVertical:4, backgroundColor: '#f2f9ff', alignItems:'center', marginHorizontal:5}}>
          <View style={{minWidth:'15%'}}>
              <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.banco}</Text>
          </View>
          <View style={{flex:2}}>
              <Text numberOfLines={1} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.cta_Bancaria}</Text>
          </View>
          <View style={{minWidth:'10%'}}>
              <Text numberOfLines={1} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.moneda}</Text>
          </View>
          <View style={{flex:1}}>
              <Text style={{fontSize:ResponsiveFont(11.5), textAlign:'right', color:item.colorTexto, fontWeight:'bold'}}>{item.montoFormat}</Text>
          </View>
      </View> 
      <Divider style={{borderWidth:0.12}}/>
  </>
    )
  }

  return (
    <Provider>
      <SafeAreaView style={{flex:1}}>
      <StatusBar backgroundColor="#325288" />
        <Header titulo="Resumen Ingresos por ventas" tituloCompleto={true} tipoMenu='drawer' botonDerecha={funcIniciarModalFiltro} />

        <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', marginTop:8}}>
          <BotonTipoGrafico texto='7A' grafico={tipoDeGrafico} tipoGrafico='7A'/>
          <BotonTipoGrafico texto='7M' grafico={tipoDeGrafico} tipoGrafico='7M'/>
          <BotonTipoGrafico texto='7D' grafico={tipoDeGrafico} tipoGrafico='7D'/>
        </View>

        <View style={{justifyContent:'center', alignItems:'center', marginTop:-15}}>
          {
            (verCargaGrafica)
              ? <IndicadorDeCarga height={Dimensions.get('window').height/3} size={15} />
              : <VictoryChart domainPadding={ResponsiveFont(20)}  height={Dimensions.get('window').height/3} width={ResponsiveFont(350)} 
                  animate={{duration:1000}}>
                  <VictoryAxis width={Dimensions.get('window').width} style={{ tickLabels: {fontSize: ResponsiveFont(10)} }}/>
                    <VictoryBar
                      cornerRadius={{ topLeft: () => 5, topRight: () => 5 }}
                      labels={({ datum }) => datum.y}
                      data={ resumenVentas.map(value => value) } 
                      style={{data:{fill:'#47B5FF'}}}
                      labelComponent={
                        <VictoryLabel
                          style={[
                              { fill: "#06283D", fontSize: ResponsiveFont(10) }
                          ]}
                        />
                      }
                      events={[{
                        target: "data",
                        eventHandlers: {
                            onPressOut: (event, data) => {
                              funcSeleccionarGrafico(data.datum)
                            },
                        }
                    }]}
                    />
              </VictoryChart>
          }
        </View>
            
        <View style={{flexDirection:'row', marginHorizontal:10, marginVertical:5}}>
          {
            (verTablaInicial)
              ? <View style={{flex:1}}/>
              : <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize:ResponsiveFont(13), color:'grey'}}>{moment(filtro.fechaI).format('YYYY-MM-DD')} hasta {moment(filtro.fechaF).format('YYYY-MM-DD')}</Text>
                </View>
          }
        </View>

        <View style={{flexDirection:'row', borderBottomColor: '#73777B', borderBottomWidth:1, padding:3, marginHorizontal:5}}>
          <View style={{minWidth:'15%',padding:2}}>
              <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>Bancos</Text>
          </View>
          <View style={{flex:2, padding:2}}>
              <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>N° Cuota</Text>
          </View>
          <View style={{minWidth:'10%', padding:2}}>
              <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>Mone</Text>
          </View>
          <View style={{flex:1, padding:2}}>
              <Text  numberOfLines={1} style={{fontWeight:'bold', fontSize:ResponsiveFont(12), textAlign:'right'}}>Monto</Text>
          </View>
        </View>
        {
          (!verTablaInicial)
            ? 
                (!verCargaTabla)
                  ? 
                    <>
                      <FlatList
                        data={resumenVentasTabla}
                        keyExtractor={(value, index)=> index.toString()}
                        renderItem={renderItem}
                      />
                      <Divider style={{borderWidth:0.12}}/>
                      <View style={{flexDirection:'row', paddingLeft:4, paddingVertical:4, backgroundColor: '#f2f9ff', alignItems:'center', marginHorizontal:5}}>
                        <View style={{maxWidth:'15%'}}>
                          <Text style={{fontSize:ResponsiveFont(11.5), fontWeight:'bold', textAlign:'center', color:'#325288'}}>TOTAL</Text>
                        </View>
                        <View style={{flex:2}}/>
                        <View style={{flex:1}}>
                          <Text style={{fontSize:ResponsiveFont(12), fontWeight:'bold', color:'#325288', textAlign:'right'}}>{totalTabla}</Text>
                        </View>
                      </View>
                    </>                    
                  :
                    <IndicadorDeCarga height={100} size={15} />
              :
              <View style={{margin:10}}>
                <Text style={{fontSize:ResponsiveFont(12)}}>Debe seleccionar una barra del grafico previamente.</Text>
              </View>
        }

        <View style={{alignItems:'center', justifyContent:'center', paddingVertical:10}}>
          <Avatar.Icon size={ResponsiveFont(80)} icon="alert" style={{backgroundColor:'transparent'}} color="#F8CB2E"/>
          <Text style={{fontSize: ResponsiveFont(13), color:'grey'}}>En Construcción al 90%</Text>
        </View>

        <ModalComponent
          titulo={'Filtrar Resumen de Ingresos'}
          esVisible={verModalFiltro}
          cerrarModal={funcOcultarModalFiltro}
        >
          <View>
              <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Fecha</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1, flexDirection:'column',alignItems:'center'}}>
                  <Text style={{margin:5 ,fontSize:ResponsiveFont(12)}}>{moment(filtro.fechaI).format('YYYY-MM-DD')}</Text>
                  <Button labelStyle={{fontSize:ResponsiveFont(11)}} icon="calendar-range" mode="contained" style={{marginHorizontal:5, backgroundColor:'#35858B'}} onPress={() => abrirCalendarioInicial()} compact={true} >
                    Fecha Inicial
                  </Button>
                </View>
                <View style={{flex:1, flexDirection:'column',alignItems:'center'}}>
                  <Text style={{margin:5 ,fontSize:ResponsiveFont(12)}}>{moment(filtro.fechaF).format('YYYY-MM-DD')}</Text>
                    <Button labelStyle={{fontSize:ResponsiveFont(11)}} icon="calendar-range" mode="contained" style={{marginHorizontal:5, backgroundColor:'#35858B'}} onPress={() =>  abrirCalendarioFinal()} compact={true} >
                      Fecha Final
                    </Button>
                </View>                
              </View>
              {fechaInicialVisible && (
                  <DateTimePiker                    
                    testID="dateTimePicker"
                    display="default"
                    mode="date"
                    is24Hour={true}
                    value = {filtro.fechaI}
                    onChange={funcCambiarFiltroFechaInicial}
                  />
              )}
              {fechaFinalVisible && (
                  <DateTimePiker
                    testID="dateTimePicker"
                    display="default"
                    mode="date"
                    is24Hour={true}
                    value = {filtro.fechaF}
                    onChange={funcCambiarFiltroFechaFinal}
                  />
              )}
            </View>

            <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>

            <View>
              <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Tipo de Cliente:</Text>
              <View style={{flexDirection:'row', marginTop:5, marginHorizontal:20}}>
                <View style={{flex:1}}>
                  <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => funcCambiarDatosFiltro('tipoCliente', '-')} texto="Todos" valor='-'/>
                </View>
                <View style={{flex:1}}>
                  <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => funcCambiarDatosFiltro('tipoCliente', '02')} texto="Propias" valor='02'/>
                </View>
                <View style={{flex:1}}>
                  <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => funcCambiarDatosFiltro('tipoCliente', '01')} texto="Terceros" valor='01'/>
                </View>
              </View>
            </View>

            <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>

            <View>
              <Button mode="outlined" color='white' style={{backgroundColor:'#005db2'}} 
                labelStyle={{fontSize:ResponsiveFont(11)}} onPress={()=> funcAplicarFiltro()}>
                filtrar
              </Button>
            </View>
        </ModalComponent>

        

      </SafeAreaView>
    </Provider>
  )
}
