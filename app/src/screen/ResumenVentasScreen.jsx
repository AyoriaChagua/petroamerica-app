import React, { useState } from 'react'
import { Dimensions, FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { Avatar, Button, Divider, IconButton, Modal, Portal, Provider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import curencyformatter from 'currency-formatter'
import DateTimePiker from '@react-native-community/datetimepicker'

import { Header } from '../components/Header'
import { helpers } from '../helpers/helpers'
import { useResumenVentas } from '../hooks/useResumenVentas'
import { HeaderModal } from '../components/HeaderModal'
import { ModalComponent } from '../components/ModalComponent'
import { IndicadorDeCarga } from '../components/IndicadorDeCarga'
import stylesGlobal from '../theme/stylesGlobal'
import { RadioButtonComponent } from '../components/RadioButtonComponent'
import moment from 'moment'

export const ResumenVentasScreen = () => {
  
  const {ResponsiveFont} = helpers()
  const {
    nombreTablaVentas,
    tablaInicial,
    listaPlantas,
    verCargaTabla,
    totalResumenVenta,
    valoresResumenVenta, 
    datosGrafico, 
    tipoDeGrafico, 
    puntoSeleccionado, 
    valores, 
    ejeXGrafico, 
    tooltipPos, 
    filtro, 
    verModalFiltro, 
    verCargaGrafico,
    fechaInicialVisible,
    fechaFinalVisible,
    funcCambiarFiltroFechaInicial,
    funcFiltrarResumenVenta,
    funcCerrarModalFiltro, 
    funcAbrrirModalFiltro, 
    setTooltipPos,
    funcSeleccionarPunto, 
    funcSeleccionarTipoGrafico, 
    functCambiarTipoFiltro,
    abrirCalendarioInicial,
    abrirCalendarioFinal,
    funcCambiarFiltroFechaFinal} = useResumenVentas()
  const BotonTipoGrafico = ({texto, grafico, tipoGrafico}) => {
    return (
      <TouchableOpacity onPress={() => {funcSeleccionarTipoGrafico(tipoGrafico)}}
        style={{padding:5, borderRadius:13, borderColor:(grafico === tipoGrafico) ? '#e8e8e8' : null, borderWidth:(grafico === tipoGrafico) ? 1 : 0, backgroundColor:(grafico === tipoGrafico) ? '#e8e8e8' : null}}>
        <Text style={{fontSize:ResponsiveFont(12), color:'#3367d6'}}>{texto}</Text>
      </TouchableOpacity>
    )
  }

  const renderItem = ({item}) =>{
    return (
      <>
        <View style={{flexDirection:'row', paddingLeft:4, paddingVertical:4, backgroundColor: '#f2f9ff', alignItems:'center', marginHorizontal:5}}>
          <View style={{flex:1}}>
              <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.descripcion}</Text>
          </View>
          <View style={{flex:1}}>
              <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.valor_cred_Propi}</Text>
          </View>
          <View style={{flex:1}}>
              <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.valor_cont_terce}</Text>
          </View>
          <View style={{flex:1}}>
              <Text style={{fontSize:ResponsiveFont(11.5), fontWeight:'bold', textAlign:'center'}}>{item.valor_total}</Text>
          </View>
        </View> 
        <Divider style={{borderWidth:0.12}}/>
      </>
    )
  }

  const renderItemInicial = ({item}) => {
    return (
      <>
        <View style={{flexDirection:'row', paddingLeft:4, paddingVertical:4, backgroundColor: '#f2f9ff', alignItems:'center', marginHorizontal:5}}>
          <View style={{flex:1}}>
              <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.descripcion}</Text>
          </View>
          <View style={{flex:1}}>
              <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>0</Text>
          </View>
          <View style={{flex:1}}>
              <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>0</Text>
          </View>
          <View style={{flex:1}}>
              <Text style={{fontSize:ResponsiveFont(11.5), fontWeight:'bold', textAlign:'center'}}>0</Text>
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
          <Header titulo="Resumen de Ventas" tipoMenu='drawer' botonDerecha={false} />

          <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', marginTop:8}}>
            <BotonTipoGrafico texto='7A+P' grafico={tipoDeGrafico} tipoGrafico='7AP'/>
            <BotonTipoGrafico texto='7A' grafico={tipoDeGrafico} tipoGrafico='7A'/>
            <BotonTipoGrafico texto='7M' grafico={tipoDeGrafico} tipoGrafico='7M'/>
            <BotonTipoGrafico texto='7D' grafico={tipoDeGrafico} tipoGrafico='7D'/>
          </View>

          <View style={{justifyContent:'center', alignItems:'center'}}>
            {
              (!verCargaGrafico)
                ? <View style={{width: Dimensions.get('window').width - 16, height:Dimensions.get('window').height/3}} >
                    <IndicadorDeCarga height={Dimensions.get('window').height/3} size={15} />
                  </View>
                :
                  <LineChart
                    onDataPointClick={(e)=>{
                      let isSamePoint = (tooltipPos.x === e.x 
                        && tooltipPos.y === e.y)

                      isSamePoint ? setTooltipPos((previousState) => {
                        return { 
                                  ...previousState,
                                  value: e.value,
                                  visible: !previousState.visible
                              }
                      })
                        : 
                      setTooltipPos({ x: e.x, value: e.value, y: e.y, visible: true })  
                      funcSeleccionarPunto(e)
                    }} 
                    data={{
                        labels: ejeXGrafico.map(value=> value),
                        datasets: [
                          {
                              data: datosGrafico.map(value=> value.valor),
                              strokeWidth: 2,
                              strokeDashOffset:2
                          }
                        ],
                    }}
                    decorator={() => {
                      return tooltipPos.visible ? <View>
                          <Svg>
                              <Rect x={tooltipPos.x - 30} 
                                  y={tooltipPos.y + 10} 
                                  width="80" 
                                  height="30"
                                  fill="#748DA6" />
                                  <TextSVG
                                      x={tooltipPos.x + 10}
                                      y={tooltipPos.y + 30}
                                      fill="white"
                                      fontSize={ResponsiveFont(10)}
                                      fontWeight="bold"
                                      textAnchor="middle">
                                      {curencyformatter.format((tooltipPos.value), {code:'', precision:0})}
                                  </TextSVG>
                          </Svg>
                      </View> : null
                    }}
                    width={Dimensions.get('window').width - 16}
                    height={Dimensions.get('window').height/3}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `#748DA6`,
                      style: {
                          borderRadius: 16
                      },
                    }}
                    getDotColor={(dataPoint, dataPointIndex) => {
                      if(dataPoint === puntoSeleccionado.valor && dataPointIndex === puntoSeleccionado.indice) return '#ff0000'
                      else  return '#2978B5'
                    }}
                    style={{
                      marginVertical: 8,
                      borderRadius: 10,
                    }}
                  />
            }       
          </View>

          <View style={{flexDirection:'row', marginHorizontal:10, marginTop:-20}}>
            {
              (tablaInicial)
                ? <View style={{flex:1}}/>
                : <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:ResponsiveFont(13), color:'grey'}}>{moment(filtro.fecha1).format('DD/MM/YYYY')} hasta {moment(filtro.fecha2).format('DD/MM/YYYY')}</Text>
                  </View>
            }
              <TouchableOpacity onPress={()=> funcAbrrirModalFiltro()} style={{padding:4, borderColor:'#325288', borderWidth:1, borderRadius:15}}>
                <Avatar.Icon style={{backgroundColor:'transparent'}} color='#325288' size={ResponsiveFont(20)} icon="filter" />
              </TouchableOpacity>
          </View>
          
          <View style={{flexDirection:'row', borderBottomColor: '#73777B', borderBottomWidth:1, padding:3, marginHorizontal:5}}>
            <View style={{flex:1, padding:2}}>
                <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>Planta</Text>
            </View>
            <View style={{flex:1, padding:2}}>
                <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>{nombreTablaVentas.columna1}</Text>
            </View>
            <View style={{flex:1, padding:2}}>
                <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>{nombreTablaVentas.columna2}</Text>
            </View>
            <View style={{flex:1, padding:2}}>
                <Text  numberOfLines={1} style={{fontWeight:'bold', fontSize:ResponsiveFont(12), textAlign:'center'}}>Total</Text>
            </View>
          </View>

          <View style={{flex:1}}>
            {
              (verCargaTabla)
                ? 
                  ((tablaInicial) ? listaPlantas.length > 0 : valoresResumenVenta.length > 0)
                    ?  
                    <>
                      <FlatList
                        data={(tablaInicial) ? listaPlantas : valoresResumenVenta}
                        key={(value) => value.id_planta}
                        renderItem={(tablaInicial) ? renderItemInicial : renderItem}
                      />
                      <Divider style={{borderWidth:0.12}}/>
                        <View style={{flexDirection:'row', paddingLeft:4, paddingVertical:4, backgroundColor: '#f2f9ff', alignItems:'center', marginHorizontal:5}}>
                          <View style={{flex:1}}>
                            <Text style={{fontSize:ResponsiveFont(11.5), fontWeight:'bold', textAlign:'center', color:'#325288'}}>TOTAL</Text>
                          </View>
                          <View style={{flex:1}}>
                            <Text style={{fontSize:ResponsiveFont(11.5), fontWeight:'bold', textAlign:'center', color:'#325288'}}>{totalResumenVenta.propias_credito}</Text>
                          </View>
                          <View style={{flex:1}}>
                            <Text style={{fontSize:ResponsiveFont(11.5), fontWeight:'bold', textAlign:'center', color:'#325288'}}>{totalResumenVenta.terceros_contado}</Text>
                          </View>
                          <View style={{flex:1}}>
                            <Text style={{fontSize:ResponsiveFont(11.5), fontWeight:'bold', textAlign:'center', color:'#325288'}}>{totalResumenVenta.total}</Text>
                          </View>
                        </View>
                      </>
                    : <View style={{fontSize: ResponsiveFont(13), padding:15}}>
                          <Text style={{color:'grey'}}>No se encontraron Resultados</Text>
                    </View>
                : <IndicadorDeCarga height={150} size={15} />
            }          
          </View>

          <ModalComponent
            cerrarModal={funcCerrarModalFiltro} esVisible={verModalFiltro} titulo={'Filtrar Resumen de Ventas'} 
          >
            <ScrollView style={{flexDirection:'column'}} disableScrollViewPanResponder={true}>

              <View>
                <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Fecha</Text>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:1, flexDirection:'column',alignItems:'center'}}>
                      <Text style={{margin:5 ,fontSize:ResponsiveFont(12)}}>{moment(filtro.fecha1).format('DD-MM-YYYY') || 'Inicial'}</Text>
                      <Button labelStyle={{fontSize:ResponsiveFont(11)}} icon="calendar-range" mode="contained" style={{marginHorizontal:5, backgroundColor:'#35858B'}} onPress={() => abrirCalendarioInicial()} compact={true} >
                        Fecha Inicial
                      </Button>
                  </View>
                  <View style={{flex:1, flexDirection:'column',alignItems:'center'}}>
                      <Text style={{margin:5 ,fontSize:ResponsiveFont(12)}}>{moment(filtro.fecha2).format('DD-MM-YYYY') || 'Final'}</Text>
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
                      value = {filtro.fecha1}
                      onChange={funcCambiarFiltroFechaInicial}
                    />
                )}
                {fechaFinalVisible && (
                    <DateTimePiker
                      testID="dateTimePicker"
                      display="default"
                      mode="date"
                      is24Hour={true}
                      value = {filtro.fecha2}
                      onChange={funcCambiarFiltroFechaFinal}
                    />
                )}
              </View>

              <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>

              <View style={{}}>
              <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Tipo de Reporte:</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <View style={{marginTop:5, marginHorizontal:20}}>
                    <RadioButtonComponent status={filtro.tipo} checkFuncion={()=>{functCambiarTipoFiltro('TIPOCLIENTE')}} texto="Propias y Terceros" valor="TIPOCLIENTE"/>
                  </View>
                </View>
                <View style={{flex:1}}>
                  <View style={{marginTop:5, marginHorizontal:20}}>
                  <RadioButtonComponent status={filtro.tipo} checkFuncion={()=>{functCambiarTipoFiltro('TIPOPAGO')}} texto="Contado y Credito" valor="TIPOPAGO"/>
                  </View>
                </View>
              </View>
              </View>

              <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>

              <View>
                <Button mode="outlined" color='white' style={{backgroundColor:'#005db2'}} 
                    labelStyle={{fontSize:ResponsiveFont(11)}} onPress={() => {funcFiltrarResumenVenta()}}>
                    filtrar
                </Button>
              </View>

              </ScrollView>
          </ModalComponent>

        

      </SafeAreaView>
    </Provider>
  )
}
